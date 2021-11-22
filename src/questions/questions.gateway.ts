import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Server } from 'socket.io';
import { UpdateQuestionDto } from './dto/update-question.dto';

@WebSocketGateway()
export class QuestionsGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly questionsService: QuestionsService) {}

  @SubscribeMessage('createQuestion')
  async create(@MessageBody() createQuestionDto: CreateQuestionDto) {
    this.server.emit(
      'question',
      await this.questionsService.create(createQuestionDto),
    );
  }

  @SubscribeMessage('findAllQuestions')
  async findAllByClass(@MessageBody() idClass: string) {
    return {
      event: 'questions',
      data: await this.questionsService.findByClass(idClass),
    };
  }

  @SubscribeMessage('findOneQuestion')
  findOne(@MessageBody() id: number) {
    return this.questionsService.findOne(id);
  }

  @SubscribeMessage('updateQuestion')
  update(@MessageBody() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(
      updateQuestionDto.id,
      updateQuestionDto,
    );
  }

  @SubscribeMessage('removeQuestion')
  remove(@MessageBody() id: number) {
    return this.questionsService.remove(id);
  }
}
