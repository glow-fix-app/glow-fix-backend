import { NestFactory } from '@nestjs/core';
import { AppModule } from '../server/src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverless from 'serverless-http';
import 'reflect-metadata';

const expressApp = express();

let cachedServer: any;

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.enableCors();

  await app.init();

  return serverless(expressApp);
}

export default async function handler(req, res) {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }

  return cachedServer(req, res);
}