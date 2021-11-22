import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsGateway } from './questions.gateway';
import { QuestionsService } from './questions.service';

describe('QuestionsGateway', () => {
  let gateway: QuestionsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionsGateway, QuestionsService],
    }).compile();

    gateway = module.get<QuestionsGateway>(QuestionsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
