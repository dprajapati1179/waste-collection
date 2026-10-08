import type { ApiErrorCode, ValidationIssue } from '@waste-collection/types';

export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
    readonly details?: ValidationIssue[],
  ) {
    super(message);
    this.name = 'AppError';
  }
}
