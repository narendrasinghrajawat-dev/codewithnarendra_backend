import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppConfigService } from '../../config/app.config';

@Injectable()
export class DatabaseConnection implements OnModuleInit, OnModuleDestroy {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: AppConfigService,
  ) {}

  async onModuleInit() {
    if (this.connection.readyState === 0) {
      await this.connection.asPromise();
      console.log('Database connected successfully');
    }
  }

  async onModuleDestroy() {
    await this.connection.close();
    console.log('Database connection closed');
  }

  async healthCheck(): Promise<boolean> {
    return this.connection.readyState === 1;
  }
}
