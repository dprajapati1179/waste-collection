import type { CreateCollectionRequest } from '@waste-collection/types';

import { prisma } from '../src/lib/prisma';

export function buildPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const valid: CreateCollectionRequest = {
    qr_id: 'BAG-1001',
    weight: 12.5,
    timestamp: '2026-10-08T10:30:00.000Z',
  };
  return { ...valid, ...overrides };
}

export async function resetDatabase() {
  await prisma.collection.deleteMany();
}
