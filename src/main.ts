import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // FRONTEND_URL may hold a comma-separated list (local dev + deployed site)
  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    // Browsers send Origin without a trailing slash, so a configured
    // "https://site.com/" would never match — normalise it away.
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser clients (curl, server-side fetch) which send no Origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // Strip unknown fields instead of rejecting the whole submission —
      // the contact form must not 400 just because it posts an extra field.
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Owlex API')
    .setDescription('Owlex landing page backend API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Application running on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
