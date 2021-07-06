import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ClassRoom } from 'src/class-room/entities/class-room.entity';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ get: (value: any) => value?.toString() })
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

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClassRoom' }] })
  classes: ClassRoom[];
}

export const UserSchema = SchemaFactory.createForClass(User);
