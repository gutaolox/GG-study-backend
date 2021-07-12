import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@WebSocketGateway()
export class QuestionsGateway {
  constructor(private readonly questionsService: QuestionsService) {}

  @SubscribeMessage('createQuestion')
  create(@MessageBody() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @SubscribeMessage('findAllQuestions')
  findAll() {
    return this.questionsService.findAll();
  }

  @SubscribeMessage('findOneQuestion')
  findOne(@MessageBody() id: number) {
    return this.questionsService.findOne(id);
  }

  @SubscribeMessage('updateQuestion')
  update(@MessageBody() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(updateQuestionDto.id, updateQuestionDto);
  }

  @SubscribeMessage('removeQuestion')
  remove(@MessageBody() id: number) {
    return this.questionsService.remove(id);
  }
}
