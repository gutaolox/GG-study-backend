import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { ClassRoomService } from './class-room.service';
import { CreateClassRoomDto } from './dto/create-class-room.dto';
import { UpdateClassRoomDto } from './dto/update-class-room.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Server, Socket } from 'socket.io';
import { ConnectedStudent } from './dto/connected-student.dto';
import { UsersService } from 'src/users/users.service';
import { generateTwilloToken } from 'src/auth/jwt.twillo';
import { User } from 'src/users/entities/user.entity';
import { PageDto } from './dto/new-page.dto';
import { PointDto } from './dto/point-model.dto';

@WebSocketGateway()
export class ClassRoomGateway {
  @WebSocketServer()
  server: Server;

  classes: any[];
  constructor(
    private readonly classRoomService: ClassRoomService,
    private readonly usersService: UsersService,
  ) {
    this.classes = [];
  }

  //@UseGuards(JwtAuthGuard)
  @SubscribeMessage('initClassroom')
  async create(
    @ConnectedSocket() client: Socket,
    @MessageBody() createClassRoomDto: CreateClassRoomDto,
  ) {
    const newClass = await this.classRoomService.setClassState(
      createClassRoomDto.idClass,
      true,
    );

    const professor = await this.usersService.findOne(newClass.professor.user);

    client.emit('classCreated', {
      _id: newClass._id,
      connectToken: generateTwilloToken(professor.name, newClass._id),
      page: newClass.page,
      totalPages: newClass.totalPage,
    });
  }

  @SubscribeMessage('updatePage')
  async setPage(
    @ConnectedSocket() client: Socket,
    @MessageBody() newPageDto: PageDto,
  ) {
    await this.classRoomService.setPage(newPageDto.idClass, newPageDto.newPage);
    this.server.emit('newPage', {
      newPage: newPageDto.newPage,
    });
  }

  @SubscribeMessage('updatePoint')
  async setPoint(
    @ConnectedSocket() client: Socket,
    @MessageBody() newPointDto: PointDto,
  ) {
    this.server.emit('newPoint', newPointDto);
  }

  @SubscribeMessage('closeClassroom')
  async close(
    @ConnectedSocket() client: Socket,
    @MessageBody() createClassRoomDto: CreateClassRoomDto,
  ) {
    await this.classRoomService.setClassState(
      createClassRoomDto.idClass,
      false,
    );

    client.emit('classClosed');
  }

  @SubscribeMessage('findAllClassRoomByProfessor')
  async findAllClassesByProfessor(@MessageBody() idProfessor: number) {
    return {
      event: 'getClassRoomByProfessor',
      data: await this.classRoomService.findAllByProfessor(idProfessor),
    };
  }

  @SubscribeMessage('findAllClassRoomByStudent')
  async findAllClassesByStudent(
    @ConnectedSocket() client: Socket,
    @MessageBody() idStudent: string,
  ) {
    client.emit(
      'getClassRoomByStudent',
      await this.classRoomService.findAllByStudent(idStudent),
    );
  }

  @SubscribeMessage('findOneClassRoom')
  findOne(@MessageBody() id: number) {
    return this.classRoomService.findOne(id);
  }

  @SubscribeMessage('addStudent')
  async addStudent(
    @ConnectedSocket() client: Socket,
    @MessageBody() connectedStudent: ConnectedStudent,
  ) {
    const newClass = await this.classRoomService.addStudent(
      client.id,
      connectedStudent,
    );
    if (newClass) {
      const newStudent = await this.usersService.findOne(
        connectedStudent.idStudent,
      );
      client.emit('connectToken', {
        videoToken: generateTwilloToken(
          newStudent.name,
          connectedStudent.idClass,
        ),
        page: newClass.page,
        totalPages: newClass.totalPage,
      });
      this.server.emit('newStudent', {
        id: newStudent._id,
        name: newStudent.name,
      });
    }
  }

  @SubscribeMessage('quitClass')
  async quitClass(
    @ConnectedSocket() client: Socket,
    @MessageBody() connectedStudent: ConnectedStudent,
  ) {
    await this.classRoomService.removeStudent(client.id, connectedStudent);
    const removedStudent = await this.usersService.findOne(
      connectedStudent.idStudent,
    );
    this.server.emit('removedStudent', {
      id: removedStudent._id,
      name: removedStudent.name,
    });
  }

  // @SubscribeMessage('updateClassRoom')
  // update(@MessageBody() updateClassRoomDto: UpdateClassRoomDto) {
  //   return this.classRoomService.update(
  //     updateClassRoomDto.id,
  //     updateClassRoomDto,
  //   );
  // }

  @SubscribeMessage('removeClassRoom')
  remove(@MessageBody() id: number) {
    return this.classRoomService.remove(id);
  }

  @SubscribeMessage('findAllOnlineStudentsByClass')
  async findAllOnlineStudentsByClass(@MessageBody() idClass: number | string) {
    return {
      event: 'getAllOnlineStudentsByClass',
      data: await this.classRoomService.findAllOnlineStudentsByClass(idClass),
    };
  }
}
