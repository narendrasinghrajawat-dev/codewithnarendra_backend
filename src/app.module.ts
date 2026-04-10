import { Module } from '@nestjs/common';
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
    // MongoDB connection
    MongooseModule.forRoot({
      uri: new AppConfigService().mongodbUri(),
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
