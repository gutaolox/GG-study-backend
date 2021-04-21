import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type ClassRoomDocument = ClassRoom & Document;

@Schema()
export class ClassRoom {
  @Prop({ get: (value: any) => value?.toString() })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ default: Date.now() })
  startDate: Date;

  @Prop()
  finishDate: Date;

  @Prop(
    raw({
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        get: (value: any) => value?.toString(),
      },
      clientId: { type: String },
    }),
  )
  professor: Record<string, any>;

  @Prop(
    raw([
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          get: (value: any) => value?.toString(),
        },
        clientId: { type: String },
      },
    ]),
  )
  students: Record<string, any[]>;
}

export const ClassRoomSchema = SchemaFactory.createForClass(ClassRoom);
