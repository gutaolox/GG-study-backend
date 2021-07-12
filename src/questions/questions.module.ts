import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsGateway } from './questions.gateway';

@Module({
  providers: [QuestionsGateway, QuestionsService]
})
export class QuestionsModule {}
