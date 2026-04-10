import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  private readonly env: NodeJS.ProcessEnv;

  constructor() {
    this.env = process.env;
  }

  get port(): number {
    return parseInt(this.env['PORT'] || '3000', 10);
  }

  get nodeEnv(): string {
    return this.env['NODE_ENV'] || 'development';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get mongodbUri(): string {
    return this.env['MONGODB_URI'] || 'mongodb://localhost:27017/myfolio';
  }

  get jwtSecret(): string {
    return this.env['JWT_SECRET'] || 'your-secret-key';
  }

  get jwtExpiration(): string {
    return this.env['JWT_EXPIRATION'] || '7d';
  }

  get corsOrigins(): string[] {
    const origins = this.env['CORS_ORIGINS'];
    return origins ? origins.split(',') : ['http://localhost:3000'];
  }

  get apiPrefix(): string {
    return this.env['API_PREFIX'] || '/api';
  }
}
