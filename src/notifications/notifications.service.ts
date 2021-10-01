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
import { User } from 'src/users/entities/user.entity';

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

  findClass(idClass: string, filterNotReleased: boolean, getAnswer = false) {
    return this.notificationModel
      .find(
        {
          classRoom: idClass,
          $or: [{ released: true }, { released: filterNotReleased }],
        },
        getAnswer ? '' : '-answer',
      )
      .sort('order')
      .populate('participants.user', '_id name', 'User')
      .exec();
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }

  async newStudent(idClass: string, idStudent: string) {
    const exercises = await this.findClass(idClass, true);
    let initFirst = true;
    for (const exerciseReleased of exercises) {
      if (exerciseReleased) {
        exerciseReleased.participants.push({
          user: Types.ObjectId(idStudent),
          answer: '',
          timeStarted: initFirst ? Date.now() : 0,
          timeFinished: 0,
        });
        initFirst = false;
        await exerciseReleased.save();
      }
    }
    return exercises;
  }

  async updateExercises(idClass: string) {
    const onlineUsers = await this.classRoomService.findAllOnlineStudentsByClass(
      idClass,
    );
    const exercises = await this.findClass(idClass, false);
    const orderValue = exercises.map((exercise) => exercise.order);
    let initFirst = true;
    for (const exerciseReleased of exercises) {
      if (exerciseReleased) {
        exerciseReleased.released = true;
        exerciseReleased.timeReleased = Date.now();
        exerciseReleased.participants = onlineUsers.map((user) => {
          return {
            user: user.user,
            answer: '',
            timeStarted: initFirst ? Date.now() : 0,
            timeFinished: 0,
          };
        });
        initFirst = false;
        await exerciseReleased.save();
      }
    }

    return exercises;
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
      const nextExerciseParticipantIndex = nextExercise.participants.findIndex(
        (participant) => {
          return participant.user.toString() === idStudent;
        },
      );

      nextExercise.participants.splice(nextExerciseParticipantIndex, 1, {
        user: nextExercise.participants[nextExerciseParticipantIndex].user,
        answer: '',
        timeStarted: Date.now(),
        timeFinished: 0,
      });
      nextExercise.save();
    }

    if (lastExercise) {
      const userIndex = lastExercise.participants.findIndex(
        (participant) => participant.user.toString() === idStudent,
      );
      const changeParticipants = [...lastExercise.participants];
      lastExercise.participants.splice(userIndex, 1, {
        user: changeParticipants[userIndex].user,
        answer: answer,
        timeStarted: changeParticipants[userIndex].timeStarted,
        timeFinished: Date.now(),
      });
      await lastExercise.save();
    }
  }

  async calculateMetrics(idClass: string) {
    const exercizes = await this.findClass(idClass, true, true);

    return exercizes.map((exercize, index) => {
      const toDo = exercize.participants.reduce((previousValue, nextValue) => {
        return previousValue + nextValue.timeStarted ? 0 : 1;
      }, 0);
      const doing = exercize.participants.reduce((previousValue, nextValue) => {
        return (
          previousValue +
          (nextValue.timeStarted && !nextValue.timeFinished ? 1 : 0)
        );
      }, 0);
      const done = exercize.participants.reduce((previousValue, nextValue) => {
        return (
          previousValue +
          (nextValue.timeStarted && nextValue.timeFinished ? 1 : 0)
        );
      }, 0);
      const howManyGotIt = exercize.participants.reduce(
        (previousValue, nextValue) => {
          return previousValue + (nextValue.answer === exercize.answer ? 1 : 0);
        },
        0,
      );
      console.log(howManyGotIt);
      return {
        _id: exercize._id,
        title: `Exercicio: ${exercize.order}`,
        toDo,
        doing,
        done,
        percentRight: `${(howManyGotIt / done) * 100}%`,
        participants: exercize.participants
          .map((participant) => {
            if (participant.timeStarted && !participant.timeFinished) {
              const user = participant.user as User;
              return {
                _id: user._id,
                name: user.name,
                timeStarted: participant.timeStarted,
              };
            }
          })
          .filter((participant) => !!participant),
      };
    });
  }
}
