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
  async findAll(
    @ConnectedSocket() client: Socket,
    @MessageBody() filter: NotificationDto,
  ) {
    const notificationsList = await this.notificationsService.findClass(
      filter.idClass,
      false,
    );
    if (notificationsList && notificationsList.length) {
      client.emit('noFilterNotifications', notificationsList);
    }
  }

  @SubscribeMessage('findOneNotification')
  findOne(@MessageBody() id: number) {
    return this.notificationsService.findOne(id);
  }

  @SubscribeMessage('addingStudentClassNotification')
  async findByClass(
    @ConnectedSocket() client: Socket,
    @MessageBody() filter: NotificationDto,
  ) {
    const notificationsList = await this.notificationsService.newStudent(
      filter.idClass,
      filter.studentId,
    );
    if (notificationsList && notificationsList.length) {
      client.emit('notifications', {
        notifications: notificationsList,
        lastOrder: 1,
      });
    }
  }

  @SubscribeMessage('getMetrics')
  async getMetrics(
    @ConnectedSocket() client: Socket,
    @MessageBody() filter: NotificationDto,
  ) {
    const metricsList = await this.notificationsService.calculateMetrics(
      filter.idClass,
    );

    client.emit('metricsAnswer', {
      metrics: metricsList,
    });
  }

  @SubscribeMessage('releaseExercises')
  async releaseExercises(
    @ConnectedSocket() client: Socket,
    @MessageBody() filter: NotificationDto,
  ) {
    const notificationsList = await this.notificationsService.updateExercises(
      filter.idClass,
    );
    this.server.emit('notifications', {
      notifications: notificationsList,
      lastOrder: 1,
    });
  }

  @SubscribeMessage('nextExercises')
  async nextExercises(
    @ConnectedSocket() client: Socket,
    @MessageBody() filter: NotificationDto,
  ) {
    await this.notificationsService.nextExercise(
      filter.idClass,
      filter.nextOrder,
      filter.studentId,
      filter.answer,
    );
    //client.emit('showExercise', notificationsList);
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
