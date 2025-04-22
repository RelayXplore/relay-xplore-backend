import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import logger from './utils/logger';

const { PORT = 4000, API_VERSION = 'v1' } = process.env;

async function bootstrap() {
  console.log('POSTGRES_HOST', process.env.POSTGRES_HOST);

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Use Helmet for security headers
  app.use(helmet());

  app.setGlobalPrefix(API_VERSION);

  const options = new DocumentBuilder()
    .setTitle(`Relay Xplore Backend`)
    .setDescription(
      `The Relay Xplore Backend is an API that serves the Relay Xplore SDK`,
    )
    .setVersion('1.0')
    .addTag('Relay-Xplore-API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${API_VERSION}/doc-api`, app, document);

  await app.listen(PORT);
  logger.info(`Server running on http://localhost:${PORT}/v1/doc-api`);
}
bootstrap();
