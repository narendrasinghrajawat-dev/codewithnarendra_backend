import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: new AppConfigService().corsOrigins(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix for all routes
  app.setGlobalPrefix(new AppConfigService().apiPrefix());

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // API documentation
  SwaggerModule.setupDocumentBuilder(app)
    .setTitle('MyFolio API')
    .setDescription('Portfolio management API')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('projects')
    .addTag('skills')
    .addTag('education')
    .addTag('about')
    .build();

  const port = new AppConfigService().port();
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}${new AppConfigService().apiPrefix()}`);
}

bootstrap();
