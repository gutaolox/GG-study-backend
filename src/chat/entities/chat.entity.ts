import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ get: (value: any) => value?.toString() })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  date: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
