# MyFolio NestJS Microservices Architecture

## Microservices Structure

```
src/
├── modules/                    # Feature-based microservices
│   ├── auth/                  # Authentication Microservice
│   │   ├── controllers/       # Auth controllers
│   │   ├── services/          # Auth business logic
│   │   ├── dto/               # Data transfer objects
│   │   ├── schemas/           # Mongoose schemas
│   │   ├── repositories/      # Data access layer
│   │   ├── strategies/        # Passport strategies
│   │   └── guards/            # Auth guards
│   ├── about/                 # About Microservice
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   ├── schemas/
│   │   └── repositories/
│   ├── education/             # Education Microservice
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   ├── schemas/
│   │   └── repositories/
│   ├── projects/              # Projects Microservice
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   ├── schemas/
│   │   └── repositories/
│   ├── skills/                # Skills Microservice
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   ├── schemas/
│   │   └── repositories/
│   ├── portfolio/             # Portfolio Microservice
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   ├── schemas/
│   │   └── repositories/
│   └── admin/                 # Admin Microservice
│       ├── controllers/
│       ├── services/
│       ├── dto/
│       ├── schemas/
│       └── repositories/
├── common/                    # Shared infrastructure
│   ├── config/                # Configuration
│   ├── decorators/            # Custom decorators
│   ├── dto/                   # Shared DTOs
│   ├── entities/              # Shared entities
│   ├── exceptions/            # Custom exceptions
│   ├── filters/               # Exception filters
│   ├── guards/                # Auth/authorization guards
│   ├── interceptors/          # Request/response interceptors
│   ├── interfaces/            # Shared interfaces
│   ├── middleware/            # Custom middleware
│   ├── pipes/                 # Validation pipes
│   └── utils/                 # Utility functions
├── database/                  # Database setup
│   ├── connections/           # Database connections
│   ├── migrations/            # Database migrations
│   └── seeds/                 # Seed data
├── config/                    # Application configuration
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── microservices.config.ts
├── app.module.ts              # Root module
└── main.ts                    # Application entry point
```

## Microservices Communication

- **HTTP/REST**: Primary communication protocol
- **Event-Driven**: For async operations (future implementation)
- **API Gateway**: Single entry point (main.ts)
- **Service Discovery**: Built-in NestJS module system

## Authentication & Authorization

- **JWT**: Stateless authentication
- **Passport**: Authentication framework
- **Role-based Access Control**: Admin, User roles
- **Guards**: Route-level protection
- **Middleware**: Request-level validation

## Database Architecture

- **MongoDB**: Primary database
- **Mongoose**: ODM for MongoDB
- **Connection Pooling**: Optimized connections
- **Indexing**: Performance optimization
- **Validation**: Schema-level validation

## API Endpoints Structure

### Auth Microservice
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh
- POST /auth/forgot-password
- POST /auth/reset-password
- POST /auth/verify-email
- POST /auth/change-password
- GET /auth/me
- PUT /auth/me

### About Microservice
- GET /about
- PUT /about
- PATCH /about/field
- POST /about/resume
- DELETE /about/resume
- GET /about/public

### Education Microservice
- GET /education
- GET /education/:id
- POST /education
- PUT /education/:id
- DELETE /education/:id
- GET /education/type/:type
- GET /education/search
- GET /education/public

### Projects Microservice
- GET /projects
- GET /projects/:id
- POST /projects
- PUT /projects/:id
- DELETE /projects/:id
- GET /projects/featured
- GET /projects/search
- GET /projects/category/:category
- POST /projects/:id/images
- DELETE /projects/:id/images

### Skills Microservice
- GET /skills
- GET /skills/:id
- POST /skills
- PUT /skills/:id
- DELETE /skills/:id
- GET /skills/category/:category
- GET /skills/level/:level
- GET /skills/search

### Portfolio Microservice
- GET /portfolio
- GET /portfolio/public
- GET /portfolio/stats
- GET /portfolio/analytics
- PUT /portfolio
- POST /portfolio/export
- POST /portfolio/import

### Admin Microservice
- GET /admin/dashboard
- GET /admin/users
- POST /admin/users
- PUT /admin/users/:id
- DELETE /admin/users/:id
- GET /admin/projects
- GET /admin/skills
- GET /admin/education
- GET /admin/analytics
- GET /admin/reports

## Production Features

- **Validation**: Class-validator with DTOs
- **Error Handling**: Global exception filters
- **Logging**: Winston logger
- **Rate Limiting**: Request throttling
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Compression**: Response compression
- **Swagger**: API documentation
- **Health Checks**: Service monitoring
- **Environment Configuration**: Multi-environment support
