import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [UsersModule],
})
export class ChatModule {}
