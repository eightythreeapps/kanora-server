import { Request, Response, NextFunction } from 'express';
import { ValidationError as ExpressValidationError, Result } from 'express-validator';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError, ValidationError, ValidationErrorDetail } from '../utils/errors';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error | Result<ValidationErrorDetail>,
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
  if (Array.isArray(err)) {
    const validationErrors: ValidationErrorDetail[] = err.map(error => ({
      type: error.type,
      msg: error.msg,
      param: error.param,
      location: error.location,
    }));

    const validationError = new ValidationError('Validation failed', validationErrors);
    res.status(400).json(validationError.toJSON());
    return;
  }

  // Handle Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    const statusCode = 400;
    const appError = new AppError(err.message, statusCode, {
      code: err.code,
      meta: err.meta,
    });
    res.status(statusCode).json(appError.toJSON());
    return;
  }

  // Handle custom AppError instances
  if (err instanceof AppError) {
    res.status(err.statusCode).json(err.toJSON());
    return;
  }

  // Handle unknown errors
  const internalError = new AppError(
    'Internal server error',
    500,
    process.env.NODE_ENV === 'development' ? { stack: err instanceof Error ? err.stack : undefined } : undefined
  );
  res.status(500).json(internalError.toJSON());
}; 