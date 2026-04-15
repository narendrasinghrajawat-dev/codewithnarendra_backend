export class ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
  timestamp: string;

  constructor(success: boolean, message: string, data: T | null = null, error: any = null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  static error(message: string, code?: string, details?: any): ApiResponse {
    return new ApiResponse(false, message, undefined, {
      code: code || 'INTERNAL_ERROR',
      message,
      details,
    });
  }
}

export class PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };

  constructor(
    message: string,
    data: T[],
    pagination: any,
    success: boolean = true,
  ) {
    super(success, message, data);
    this.pagination = pagination;
  }
}
