import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getValidatedEnv } from '@ai-interviewer/config';

async function bootstrap() {
  const env = getValidatedEnv();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(env.API_PORT);
  console.log(`[API] Server running on port ${env.API_PORT}`);
}

bootstrap();
