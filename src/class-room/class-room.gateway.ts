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
  @SubscribeMessage('createClassRoom')
  async create(
    @ConnectedSocket() client: Socket,
    @MessageBody() createClassRoomDto: CreateClassRoomDto,
  ) {
    const newClass = await this.classRoomService.create(
      createClassRoomDto,
      client.id,
    );

    const professor = await this.usersService.findOne(
      createClassRoomDto.professorId,
    );

    client.emit('classCreated', {
      _id: newClass._id,
      connectToken: generateTwilloToken(professor.username, newClass._id),
    });
  }

  @SubscribeMessage('findAllClassRoom')
  async findAll() {
    return {
      event: 'getClassRoom',
      data: await this.classRoomService.findAll(),
    };
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
    this.classRoomService.addStudent(client.id, connectedStudent);
    const newStudent = await this.usersService.findOne(
      connectedStudent.idStudent,
    );
    client.emit('connectToken', {
      videoToken: generateTwilloToken(
        newStudent.username,
        connectedStudent.idClass,
      ),
    });
    this.server.emit('newStudent', {
      id: newStudent._id,
      name: newStudent.name,
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
}
