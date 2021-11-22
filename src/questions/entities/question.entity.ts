import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { ClassRoom } from 'src/class-room/entities/class-room.entity';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop({ get: (value: any) => value?.toString() })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  date: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClassRoom',
  })
  classRoom: ClassRoom | Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
