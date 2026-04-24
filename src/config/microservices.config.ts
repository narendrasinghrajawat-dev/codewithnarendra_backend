import { registerAs } from '@nestjs/config';

export const microservicesConfig = registerAs('microservices', () => ({
  transport: process.env['MICROSERVICES_TRANSPORT'] || 'TCP',
  auth: {
    host: process.env['AUTH_SERVICE_HOST'] || 'localhost',
    port: parseInt(process.env['AUTH_SERVICE_PORT'] || '3001'),
  },
  about: {
    host: process.env['ABOUT_SERVICE_HOST'] || 'localhost',
    port: parseInt(process.env['ABOUT_SERVICE_PORT'] || '3002'),
  },
  education: {
    host: process.env['EDUCATION_SERVICE_HOST'] || 'localhost',
    port: parseInt(process.env['EDUCATION_SERVICE_PORT'] || '3003'),
  },
  projects: {
    host: process.env['PROJECTS_SERVICE_HOST'] || 'localhost',
    port: parseInt(process.env['PROJECTS_SERVICE_PORT'] || '3004'),
  },
  skills: {
    host: process.env['SKILLS_SERVICE_HOST'] || 'localhost',
    port: parseInt(process.env['SKILLS_SERVICE_PORT'] || '3005'),
  },
  portfolio: {
    host: process.env['PORTFOLIO_SERVICE_HOST'] || 'localhost',
    port: parseInt(process.env['PORTFOLIO_SERVICE_PORT'] || '3006'),
  },
  admin: {
    host: process.env['ADMIN_SERVICE_HOST'] || 'localhost',
    port: parseInt(process.env['ADMIN_SERVICE_PORT'] || '3007'),
  },
}));
