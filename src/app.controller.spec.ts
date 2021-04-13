import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test/mongo.mock';
import { AppController } from './app.controller';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), AuthModule],
      providers: [AppController, AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  describe('root', () => {
    it('should return userInfos', () => {
      expect(
        appController.getProfile({
          user: {
            _id: 'teste',
            username: 'gutao',
            role: 'Admin',
          },
        }),
      ).toMatchObject({
        _id: 'teste',
        username: 'gutao',
        role: 'Admin',
      });
    });
  });
});
