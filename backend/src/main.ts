import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
    throw new Error('JWT_SECRET debe estar definido (mínimo 32 caracteres) en producción.');
  }

  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  
  // En producción define CORS_ORIGINS=https://goldreefautos.com,https://www.goldreefautos.com
  const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:4200')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Backend de Concesionaria ejecutándose en: http://localhost:${port}/api`);
}
bootstrap();
