export class AppException extends Error {
  public readonly statusCode: number;
  public override readonly message: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ConflictException extends AppException {
  constructor(message: string) {
    super(message, 409);
  }
}

export class NotFoundException extends AppException {
  constructor(message: string) {
    super(message, 404);
  }
}

export class BadRequestException extends AppException {
  constructor(message: string) {
    super(message, 400);
  }
}

export class InternalServerErrorException extends AppException {
  constructor(message: string) {
    super(message, 500);
  }
}
