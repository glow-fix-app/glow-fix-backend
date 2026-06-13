import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { HttpExceptionFilter  } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { WinstonLoggerService } from './common/logger/winston-logger.service';
import { raw } from 'express';
//import { CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    bufferLogs: false, // Must be false to see errors if it crashes before app.useLogger is called!
    rawBody: true,  // Important for Stripe webhook
  });

  // Flush buffered logs to our custom logger
  app.useLogger(app.get(WinstonLoggerService));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  const nodeEnv = configService.get<string>('app.nodeEnv');
  const allowedOrigins =
    configService.get<string[]>('app.allowedOrigins') || [];
  const isProduction = nodeEnv === 'production';

  // Enable raw body for Stripe webhook endpoint
  app.use('/api/v1/payments/webhook/stripe', raw({ type: 'application/json' }));
  
  // ─── Security Middleware ───
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: isProduction
        ? {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", 'data:', 'https:'],
              scriptSrc: ["'self'"],
            },
          }
        : false,
    }),
  );
  app.use(compression());
  app.use(cookieParser());

  // ─── CORS ───
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-Id',
      'X-Refresh-Token',
    ],
    exposedHeaders: ['X-Request-Id'],
    maxAge: 86400, // 24 hours preflight cache
  });

  // ─── Global API Prefix & Versioning ───
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ─── Global Validation Pipe ───
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown fields
      forbidNonWhitelisted: true, // throw on unknown fields
      transform: true, // auto-transform to DTO types
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: false, // collect ALL validation errors
    }),
  );

  // ─── Global Exception Filter ───
  app.useGlobalFilters(new HttpExceptionFilter(app.get(WinstonLoggerService)));
  // app.useGlobalFilters(new HttpExceptionFilter ());

  // ─── Global Interceptors ───
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // ─── Swagger (non-production only) ───
  if (!isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Glow Fix API')
      .setDescription(
        `
        ## Car Wash Management System — REST API
        
        ### Authentication
        Use Bearer token in Authorization header:
        \`Authorization: Bearer <access_token>\`
        
        ### Versioning
        All endpoints are prefixed with \`/api/v1/\`
        `,
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
        'access-token',
      )
      .addTag('Auth', 'Authentication & authorization')
      .addTag('Customers', 'Customer profile management')
      .addTag('Vehicles', 'Customer vehicle management')
      .addTag('Bookings', 'Service booking management')
      .addTag('Staff', 'Staff operations')
      .addTag('Admin', 'Admin management')
      .addTag('Health', 'Health checks')
      .addServer(`http://localhost:${port}`, 'Local Development')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true, // remember token on page refresh
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
        docExpansion: 'none', // collapse all by default
      },
      customSiteTitle: 'Glow Fix API Docs',
    });

    logger.log(
      `📚 Swagger docs available at http://localhost:${port}/api/docs`,
    );
  }

  // ─── Graceful Shutdown ───
  app.enableShutdownHooks();

  // ─── Start Server ───
  // Register global JWT guard
  app.useGlobalGuards(app.get(JwtAuthGuard));

  await app.listen(port, '0.0.0.0', () => {
    logger.log(`🚀 Glow Fix API running in [${nodeEnv}] mode`);
  });

  logger.log(`🚀 Glow Fix API running in [${nodeEnv}] mode`);
  logger.log(`🌐 Listening on http://localhost:${port}/api/v1`);
  logger.log(`❤️  Health check: http://localhost:${port}/api/v1/health/live`);
}

bootstrap().catch((error) => {
  new Logger('Bootstrap').error('Failed to start application', error);
  process.exit(1);
});
