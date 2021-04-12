import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SocketIoAdapter } from './Adapter/socket.io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:3000' });
  app.useWebSocketAdapter(new SocketIoAdapter(app, true));
  const config = new DocumentBuilder()
    .setTitle('GG study Api')
    .setDescription('The GG Study API description')
    .setVersion('1.0')
    .addTag('dogs')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();
