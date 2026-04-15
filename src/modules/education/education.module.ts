import { Module } from '@nestjs/common';
import { EducationController } from './controllers/education.controller';
import { EducationService } from './services/education.service';

@Module({
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule {}
