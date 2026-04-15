import { Module } from '@nestjs/common';
import { AboutController } from './controllers/about.controller';
import { AboutService } from './services/about.service';

@Module({
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}
