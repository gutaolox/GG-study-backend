import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema()
export class NotificationClassInfo {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User | mongoose.Types.ObjectId;

  @Prop()
  answer: string;

  @Prop()
  timeStarted: number;

  @Prop()
  timeFinished: number;
}
