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
import { PeerService } from 'src/utils/peer.services';

@WebSocketGateway()
export class ClassRoomGateway {
  @WebSocketServer()
  server: Server;

  classes: any[];
  constructor(private readonly classRoomService: ClassRoomService) {
    this.classes = [];
  }

  //@UseGuards(JwtAuthGuard)
  @SubscribeMessage('createClassRoom')
  create(
    @ConnectedSocket() client: Socket,
    @MessageBody() createClassRoomDto: CreateClassRoomDto,
  ) {
    return this.classRoomService.create(createClassRoomDto, client.id);
  }

  @SubscribeMessage('callUser')
  createPeer(@ConnectedSocket() client: Socket, @MessageBody() peerInfo: any) {
    let selectedClass = this.classes.find(
      (auxClass) => auxClass.id === peerInfo.classId,
    );
    if (!selectedClass) {
      selectedClass = {
        id: peerInfo.classId,
        peerService: new PeerService(),
      };
      this.classes.push(selectedClass);
    }
    const newPeerSevice = selectedClass.peerService;
    newPeerSevice.addPeer(peerInfo.signalData, (signal) =>
      this.server.to(client.id).emit('callAccepted', signal),
    );
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

  @SubscribeMessage('updateClassRoom')
  update(@MessageBody() updateClassRoomDto: UpdateClassRoomDto) {
    return this.classRoomService.update(
      updateClassRoomDto.id,
      updateClassRoomDto,
    );
  }

  @SubscribeMessage('removeClassRoom')
  remove(@MessageBody() id: number) {
    return this.classRoomService.remove(id);
  }
}
