import type {
  Collection,
  CreateCollectionRequest,
  CreateCollectionResponse,
} from '@waste-collection/types';

import { errorFromResponse, networkError, SubmissionFailure } from './submissionError';

const REQUEST_TIMEOUT_MS = 10_000;

export async function submitCollection(
  apiUrl: string,
  payload: CreateCollectionRequest,
): Promise<Collection> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${apiUrl}/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch {
    throw new SubmissionFailure(networkError());
  } finally {
    clearTimeout(timeout);
  }

  const body: unknown = await response.json().catch(() => null);

  if (response.status === 201 && body !== null) {
    return (body as CreateCollectionResponse).data;
  }
  throw new SubmissionFailure(errorFromResponse(response.status, body));
}
