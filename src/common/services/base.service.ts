import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseService {
  protected formatResponse<T>(data: T, message?: string, statusCode?: number) {
    return {
      success: true,
      data,
      message: message || 'Operation successful',
      statusCode: statusCode || 200,
      timestamp: new Date().toISOString(),
    };
  }

  protected formatError(message: string, statusCode?: number, error?: any) {
    return {
      success: false,
      message,
      error,
      statusCode: statusCode || 500,
      timestamp: new Date().toISOString(),
    };
  }

  protected paginate<T>(
    data: T[],
    page: number = 1,
    limit: number = 10,
    total?: number,
  ) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: total || data.length,
        totalPages: Math.ceil((total || data.length) / limit),
        hasNext: endIndex < (total || data.length),
        hasPrev: page > 1,
      },
    };
  }
}
