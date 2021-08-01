import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Message } from 'src/message/entities/message.entity';
import { Question } from 'src/questions/entities/question.entity';
import { OnlineStudent } from './online-student.entity';
import { User } from 'src/users/entities/user.entity';

export type ClassRoomDocument = ClassRoom & Document;

@Schema()
export class ClassRoom {
  @Prop({ get: (value: any) => value?.toString() })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop(
    raw({
      user: {},
      clientId: { type: String },
    }),
  )
  professor: Record<string, any>;

  @Prop()
  inClass: boolean;

  @Prop()
  page: number;

  @Prop()
  totalPage: number;

  @Prop()
  onlineStudents: OnlineStudent[];

  @Prop()
  category: string;

  @Prop()
  group: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
  })
  students: User[] | mongoose.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
  chat: Message[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }] })
  questions: Question[];
}

export const ClassRoomSchema = SchemaFactory.createForClass(ClassRoom);
