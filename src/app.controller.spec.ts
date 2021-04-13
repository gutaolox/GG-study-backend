import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppModule } from './app.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    appController = app.get<AppController>(AppController);
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
