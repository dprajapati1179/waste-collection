import type { Collection } from '@waste-collection/types';

import { AppError } from '../errors/AppError';
import type { Collection as CollectionRecord } from '../generated/prisma/client';
import {
  DuplicateQrIdError,
  findAllCollections,
  insertCollection,
} from '../repositories/collection.repository';
import type { CreateCollectionInput } from '../schemas/collection.schema';
import { calculatePoints } from './points';

export function toCollectionDto(record: CollectionRecord): Collection {
  return {
    id: record.id,
    qr_id: record.qrId,
    weight: record.weight,
    points: record.points,
    timestamp: record.timestamp.toISOString(),
    created_at: record.createdAt.toISOString(),
  };
}

export async function createCollection(input: CreateCollectionInput): Promise<Collection> {
  try {
    const record = await insertCollection({
      qrId: input.qr_id,
      weight: input.weight,
      points: calculatePoints(input.weight),
      timestamp: new Date(input.timestamp),
    });
    return toCollectionDto(record);
  } catch (err) {
    if (err instanceof DuplicateQrIdError) {
      throw new AppError(409, 'DUPLICATE_COLLECTION', 'This bag has already been collected');
    }
    throw err;
  }
}

export async function listCollections(): Promise<Collection[]> {
  const records = await findAllCollections();
  return records.map(toCollectionDto);
}
