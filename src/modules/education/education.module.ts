import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EducationController } from './controllers/education.controller';
import { EducationService } from './services/education.service';
import { EducationSchema } from './schemas/education.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Education', schema: EducationSchema }]),
  ],
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule {}
 