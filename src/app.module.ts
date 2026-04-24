import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from './config/app.config';

// Import all feature modules
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/projects/project.module';
import { SkillModule } from './modules/skills/skill.module';
import { EducationModule } from './modules/education/education.module';
import { AboutModule } from './modules/about/about.module';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env['NODE_ENV'] === 'production'
        ? 'env/.env.prod'
        : process.env['NODE_ENV'] === 'test'
          ? 'env/.env.test'
          : 'env/.env.dev',
    }),
    
    // MongoDB connection 
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error('MONGODB_URI is not defined');
        }
        return { uri };
      },
      inject: [ConfigService],
    }),
    
    // Feature modules
    AuthModule,
    ProjectModule,
    SkillModule,
    EducationModule,
    AboutModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
})
export class AppModule {}
