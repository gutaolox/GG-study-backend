import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsGateway } from './questions.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './entities/question.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  providers: [QuestionsGateway, QuestionsService],
})
export class QuestionsModule {}
