import { Request, Response, NextFunction } from 'express';
import { Result, ValidationError } from 'express-validator';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError, ValidationError as CustomValidationError, ValidationErrorDetail } from '../utils/errors';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error | Result<ValidationError>,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error details based on type
  if (err instanceof Error) {
    logger.error('Error:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  } else {
    logger.error('Validation Error:', {
      errors: err.array(),
    });
  }

  // Handle validation errors from express-validator
  if ('array' in err && typeof err.array === 'function') {
    const validationErrors: ValidationErrorDetail[] = err.array().map(error => ({
      type: error.type,
      msg: error.msg,
      param: error.type === 'field' ? error.path : error.type,
      location: error.type === 'field' ? error.location : 'body'
    }));

    const validationError = new CustomValidationError('Validation failed', validationErrors);
    const errorResponse = validationError.toJSON();
    res.status(400).json({
      success: false,
      error: errorResponse.message,
      details: errorResponse.details
    });
    return;
  }

  // Handle Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    const statusCode = 400;
    const appError = new AppError(err.message, statusCode, {
      code: err.code,
      meta: err.meta,
    });
    const errorResponse = appError.toJSON();
    res.status(statusCode).json({
      success: false,
      error: errorResponse.message,
      details: errorResponse.details
    });
    return;
  }

  // Handle custom AppError instances
  if (err instanceof AppError) {
    const errorResponse = err.toJSON();
    res.status(err.statusCode).json({
      success: false,
      error: errorResponse.message,
      details: errorResponse.details
    });
    return;
  }

  // Handle unknown errors
  const internalError = new AppError(
    'Internal server error',
    500,
    process.env.NODE_ENV === 'development' ? { stack: err instanceof Error ? err.stack : undefined } : undefined
  );
  const errorResponse = internalError.toJSON();
  res.status(500).json({
    success: false,
    error: errorResponse.message,
    details: errorResponse.details
  });
}; 