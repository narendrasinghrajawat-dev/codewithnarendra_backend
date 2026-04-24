import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: new AppConfigService().corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // API documentation (setup before global prefix to make it accessible at root)
  const config = new DocumentBuilder()
    .setTitle('CodeWithNarendra API')
    .setDescription('Portfolio management API')
    .setVersion('1.0')
    .addServer('http://localhost:3000/api', 'Development Server')
    .addTag('auth')
    .addTag('projects')
    .addTag('skills')
    .addTag('education')
    .addTag('about')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Global prefix for all routes
  app.setGlobalPrefix(new AppConfigService().apiPrefix);

  const port = new AppConfigService().port;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}${new AppConfigService().apiPrefix}`);
} 

bootstrap(); 
       