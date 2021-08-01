import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema()
export class OnlineStudent {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    get: (value: any) => value?.toString(),
  })
  user: User | mongoose.Types.ObjectId;

  @Prop()
  clientId: string;
}
