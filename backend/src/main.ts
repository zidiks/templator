import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  app.enableCors({ origin: true });
  app.setGlobalPrefix('api');
  await app.listen(3000);
  Logger.log('Templator backend listening on http://localhost:3000', 'Bootstrap');
}

bootstrap();
