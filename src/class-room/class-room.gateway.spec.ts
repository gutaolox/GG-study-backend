import { Test, TestingModule } from '@nestjs/testing';
import { ClassRoomGateway } from './class-room.gateway';
import { ClassRoomService } from './class-room.service';

describe('ClassRoomGateway', () => {
  let gateway: ClassRoomGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassRoomGateway, ClassRoomService],
    }).compile();

    gateway = module.get<ClassRoomGateway>(ClassRoomGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
