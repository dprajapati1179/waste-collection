import type { ApiErrorResponse } from '@waste-collection/types';

import { SUBMISSION_MESSAGES, type SubmissionError } from '../types/collection';

export class SubmissionFailure extends Error {
  constructor(readonly error: SubmissionError) {
    super(error.message);
    this.name = 'SubmissionFailure';
  }
}

export const networkError = (): SubmissionError => ({
  kind: 'network',
  message: SUBMISSION_MESSAGES.network,
});

export const serverError = (): SubmissionError => ({
  kind: 'server',
  message: SUBMISSION_MESSAGES.server,
});

function isApiErrorResponse(body: unknown): body is ApiErrorResponse {
  return typeof body === 'object' && body !== null && 'error' in body;
}

export function errorFromResponse(status: number, body: unknown): SubmissionError {
  if (status === 409) {
    return { kind: 'duplicate', message: SUBMISSION_MESSAGES.duplicate };
  }
  if (status === 400) {
    const detail = isApiErrorResponse(body) ? body.error.details?.[0]?.message : undefined;
    return { kind: 'validation', message: detail ?? SUBMISSION_MESSAGES.validation };
  }
  return serverError();
}
