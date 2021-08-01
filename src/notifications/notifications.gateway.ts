import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { NotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway {
  constructor(private readonly notificationsService: NotificationsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createNotification')
  create(@MessageBody() createNotificationDto: NotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @SubscribeMessage('findAllNotifications')
  findAll() {
    return this.notificationsService.findAll();
  }

  @SubscribeMessage('findOneNotification')
  findOne(@MessageBody() id: number) {
    return this.notificationsService.findOne(id);
  }

  @SubscribeMessage('findClassNotification')
  async findByClass(
    @ConnectedSocket() client: Socket,
    @MessageBody() filter: NotificationDto,
  ) {
    console.log(filter);
    const notificationsList = await this.notificationsService.findClass(
      filter.idClass,
      true,
    );
    console.log(notificationsList);
    if (notificationsList && notificationsList.length) {
      client.emit('notifications', notificationsList);
    }
  }

  @SubscribeMessage('releaseExercises')
  async releaseExercises(
    @ConnectedSocket() client: Socket,
    @MessageBody() filter: NotificationDto,
  ) {
    const notificationsList = await this.notificationsService.updateExercises(
      filter.idClass,
      filter.orders,
      true,
    );
    this.server.emit('notifications', notificationsList);
  }

  @SubscribeMessage('nextExercises')
  async nextExercises(
    @ConnectedSocket() client: Socket,
    @MessageBody() filter: NotificationDto,
  ) {
    const notificationsList = await this.notificationsService.nextExercise(
      filter.idClass,
      filter.nextOrder,
      filter.studentId,
      filter.answer,
    );
    client.emit('showExercise', notificationsList);
  }

  @SubscribeMessage('updateNotification')
  update(@MessageBody() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(
      updateNotificationDto.id,
      updateNotificationDto,
    );
  }

  @SubscribeMessage('removeNotification')
  remove(@MessageBody() id: number) {
    return this.notificationsService.remove(id);
  }
}
