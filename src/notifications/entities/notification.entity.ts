import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Message } from 'src/message/entities/message.entity';
import { Question } from 'src/questions/entities/question.entity';
import { ClassRoom } from 'src/class-room/entities/class-room.entity';
import { NotificationClassInfo } from './notification-class-info.entity';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ get: (value: any) => value?.toString() })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  options: string[];

  @Prop()
  text: string;

  @Prop()
  answer: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClassRoom',
  })
  classRoom: ClassRoom | Types.ObjectId;

  @Prop()
  timeReleased: number;

  @Prop()
  type: string;

  @Prop()
  participants: NotificationClassInfo[];

  @Prop()
  released: boolean;

  @Prop()
  order: number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
