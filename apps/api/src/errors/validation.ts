import type { ZodError } from 'zod';

import { AppError } from './AppError';

export function validationError(error: ZodError): AppError {
  const details = error.issues.map((issue) => {
    const field = issue.code === 'unrecognized_keys' ? issue.keys.join(', ') : issue.path.join('.');
    return { field: field || 'body', message: issue.message };
  });
  return new AppError(400, 'VALIDATION_ERROR', 'Invalid request data', details);
}
