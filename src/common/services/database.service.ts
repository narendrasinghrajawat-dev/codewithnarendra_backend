import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  private readonly mongoUri: string;

  constructor() {
    this.mongoUri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/myfolio';
  }

  getConnectionUri(): string {
    return this.mongoUri;
  }

  isProduction(): boolean {
    return process.env['NODE_ENV'] === 'production';
  }

  isDevelopment(): boolean {
    return process.env['NODE_ENV'] === 'development';
  }

  isTest(): boolean {
    return process.env['NODE_ENV'] === 'test';
  }
}
