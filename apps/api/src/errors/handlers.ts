import type { ApiErrorResponse } from '@waste-collection/types';
import type { ErrorRequestHandler, RequestHandler } from 'express';

import { AppError } from './AppError';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`));
};

function isBodyParserError(err: unknown): err is { type: string; status: number } {
  return typeof err === 'object' && err !== null && 'type' in err && 'status' in err;
}

function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;

  if (isBodyParserError(err)) {
    if (err.type === 'entity.parse.failed') {
      return new AppError(400, 'VALIDATION_ERROR', 'Request body must be valid JSON');
    }
    if (err.type === 'entity.too.large') {
      return new AppError(413, 'VALIDATION_ERROR', 'Request body is too large');
    }
  }

  console.error(err);
  return new AppError(500, 'INTERNAL_ERROR', 'Something went wrong');
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const appError = toAppError(err);
  const body: ApiErrorResponse = {
    error: {
      code: appError.code,
      message: appError.message,
      ...(appError.details && { details: appError.details }),
    },
  };
  res.status(appError.status).json(body);
};
