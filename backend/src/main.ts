import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NodesNow Labs ')
    .setDescription(
      'Testing and Knowledge Preparation: Cooperative Education Program Backend Developer',
    )
    .setVersion('0.1')
    .addCookieAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:5173'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
