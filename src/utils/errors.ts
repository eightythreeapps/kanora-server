export enum ErrorCode {
  // Generic error codes (1000-1999)
  INTERNAL_ERROR = 'ERR_1000',
  VALIDATION_ERROR = 'ERR_1001',
  NOT_FOUND = 'ERR_1002',
  UNAUTHORIZED = 'ERR_1003',
  FORBIDDEN = 'ERR_1004',
  CONFLICT = 'ERR_1005',
  BAD_REQUEST = 'ERR_1006',

  // Database error codes (2000-2999)
  DB_ERROR = 'ERR_2000',
  DB_UNIQUE_VIOLATION = 'ERR_2001',
  DB_FOREIGN_KEY_VIOLATION = 'ERR_2002',
  DB_NOT_FOUND = 'ERR_2003',
  
  // Authentication error codes (3000-3999)
  AUTH_INVALID_CREDENTIALS = 'ERR_3000',
  AUTH_TOKEN_EXPIRED = 'ERR_3001',
  AUTH_TOKEN_INVALID = 'ERR_3002',
  AUTH_TOKEN_MISSING = 'ERR_3003',

  // Rate limiting error codes (4000-4999)
  RATE_LIMIT_EXCEEDED = 'ERR_4000',
}

export interface ValidationErrorDetail {
  type: string;
  msg: string;
  param: string;
  location: string;
}

export interface ErrorDetails {
  code: string;
  message: string;
  details?: ValidationErrorDetail[] | Record<string, unknown>;
}

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: ValidationErrorDetail[] | Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON(): ErrorDetails {
    return {
      code: this.constructor.name.toUpperCase(),
      message: this.message,
      ...(this.details && { details: this.details }),
    };
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: ValidationErrorDetail[]) {
    super(message, 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details?: Record<string, unknown>) {
    super(message, 404, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access', details?: Record<string, unknown>) {
    super(message, 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden', details?: Record<string, unknown>) {
    super(message, 403, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', details?: Record<string, unknown>) {
    super(message, 409, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, { code: ErrorCode.RATE_LIMIT_EXCEEDED });
  }
}

export class DatabaseError extends AppError {
  private _isOperational: boolean;

  constructor(message: string = 'Database operation failed', code: ErrorCode = ErrorCode.DB_ERROR) {
    super(message, 500, { code });
    this._isOperational = false;
  }

  get isOperational(): boolean {
    return this._isOperational;
  }
}

// Utility function to translate Prisma errors to our custom errors
export function translatePrismaError(error: any): AppError {
  if (error.code === 'P2002') { // Unique constraint violation
    return new ConflictError('Resource already exists');
  }
  if (error.code === 'P2003') { // Foreign key constraint violation
    return new DatabaseError('Related resource not found', ErrorCode.DB_FOREIGN_KEY_VIOLATION);
  }
  if (error.code === 'P2025') { // Record not found
    return new NotFoundError('Record not found');
  }
  return new DatabaseError('Database operation failed');
} 