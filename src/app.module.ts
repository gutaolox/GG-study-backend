import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { DogsModule } from './dogs/dogs.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [DogsModule,MongooseModule.forRoot('mongodb://localhost:27017/ggstudy')],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
