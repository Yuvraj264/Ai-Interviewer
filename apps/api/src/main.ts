import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getValidatedEnv } from '@ai-interviewer/config';
import { StructuredLoggerService } from './common/logger/structured-logger.service';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';

async function bootstrap() {
  const env = getValidatedEnv();
  const logger = new StructuredLoggerService();

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  // Enable graceful shutdown hooks for SIGTERM / SIGINT
  app.enableShutdownHooks();

  // Correlation ID middleware
  app.use(new CorrelationIdMiddleware().use);

  // Security hardening: Restricted CORS origin
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? ['https://interviewer.scaler.com'] : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(env.API_PORT);
  logger.log(`API Server running on port ${env.API_PORT} [Phase 10 Hardened]`, 'Bootstrap');
}

bootstrap();
