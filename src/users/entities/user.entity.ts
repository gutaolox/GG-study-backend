import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ get: (value) => value?.toString() })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ index: true, unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  salt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
