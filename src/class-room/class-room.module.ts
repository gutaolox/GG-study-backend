import { Module } from '@nestjs/common';
import { ClassRoomService } from './class-room.service';
import { ClassRoomGateway } from './class-room.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassRoom, ClassRoomSchema } from './entities/class-room.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassRoom.name, schema: ClassRoomSchema },
    ]),
    UsersModule,
  ],
  providers: [ClassRoomGateway, ClassRoomService],
  exports: [ClassRoomService],
})
export class ClassRoomModule {}
