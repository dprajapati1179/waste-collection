import type { Collection, CollectionListResponse } from '@waste-collection/types';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export async function getCollections(): Promise<Collection[]> {
  const response = await fetch(`${API_URL}/collections`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Collections request failed with status ${response.status}`);
  }

  const body = (await response.json()) as CollectionListResponse;
  return body.data;
}
