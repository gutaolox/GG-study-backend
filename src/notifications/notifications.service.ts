import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClassRoomService } from 'src/class-room/class-room.service';
import { NotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationClassInfo } from './entities/notification-class-info.entity';
import {
  Notification,
  NotificationDocument,
} from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly classRoomService: ClassRoomService,
  ) {}
  create(createNotificationDto: NotificationDto) {
    return 'This action adds a new notification';
  }

  findAll() {
    return this.notificationModel.find().exec();
  }

  findOne(id: number) {
    return this.notificationModel.findById(id).exec();
  }

  findClass(idClass: string, filterNotReleased: boolean) {
    return this.notificationModel
      .find({
        classRoom: idClass,
        $or: [{ released: true }, { released: filterNotReleased }],
      })
      .exec();
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }

  async updateExercises(
    idClass: string,
    orders: string[],
    exerciseStatus: boolean,
  ) {
    const onlineUsers = await this.classRoomService.findAllOnlineStudentsByClass(
      idClass,
    );
    const exercises = await this.findClass(idClass, false);
    const orderValue = exercises.map((exercise) => exercise.order);
    let lastOrder = Math.max(...orderValue);
    for (const order of orders) {
      const exerciseReleased = exercises.find(
        (exercise) => exercise._id === order,
      );
      if (exerciseReleased) {
        exerciseReleased.released = true;
        lastOrder++;
        exerciseReleased.order = lastOrder;
        exerciseReleased.timeReleased = Date.now();
        exerciseReleased.participants = onlineUsers.map((user) => {
          return {
            user: user.user,
            answer: '',
            timeStarted: 0,
            timeFinished: 0,
          };
        });
        await exerciseReleased.save();
      }
    }

    return this.findClass(idClass, false);
  }

  async nextExercise(
    idClass: string,
    nextOrder: number,
    idStudent: string,
    answer: string,
  ) {
    const exercises = await this.notificationModel
      .find(
        {
          classRoom: idClass,
          released: true,
          $or: [{ order: nextOrder }, { order: nextOrder - 1 }],
          order: { $ne: 0 },
          type: 'question',
        },
        '-answer',
      )
      .exec();
    const othersNotification = await this.notificationModel
      .find({
        type: { $ne: 'question' },
      })
      .exec();
    exercises.sort((a, b) => b.order - a.order);
    const nextExercise = exercises[0];
    let lastExercise = exercises[1] ?? null;

    if (nextExercise.order === nextOrder - 1) {
      lastExercise = nextExercise;
    } else {
      othersNotification.push(nextExercise);
      nextExercise.participants.find(
        (participant) => participant.user === Types.ObjectId(idStudent),
      ).timeStarted = Date.now();
      nextExercise.save();
    }

    if (lastExercise) {
      const userIndex = lastExercise.participants.findIndex(
        (participant) => participant.user.toString() === idStudent,
      );
      const changeParticipants = [...lastExercise.participants];
      changeParticipants[userIndex].answer = answer;
      changeParticipants[userIndex].timeFinished = Date.now();
      lastExercise.participants = changeParticipants;
      lastExercise.participants.splice(userIndex, 1, {
        user: changeParticipants[userIndex].user,
        answer: answer,
        timeStarted: changeParticipants[userIndex].timeStarted,
        timeFinished: Date.now(),
      });
      await lastExercise.save();
    }

    return othersNotification.sort((a, b) => a.timeReleased - b.timeReleased);
  }
}
