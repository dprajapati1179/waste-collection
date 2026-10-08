import type { CollectionListResponse, CreateCollectionResponse } from '@waste-collection/types';
import type { RequestHandler } from 'express';

import { validationError } from '../errors/validation';
import { createCollectionSchema } from '../schemas/collection.schema';
import { createCollection, listCollections } from '../services/collection.service';

export const postCollection: RequestHandler = async (req, res) => {
  const parsed = createCollectionSchema.safeParse(req.body);
  if (!parsed.success) throw validationError(parsed.error);

  const collection = await createCollection(parsed.data);
  const body: CreateCollectionResponse = { data: collection };
  res.status(201).json(body);
};

export const getCollections: RequestHandler = async (_req, res) => {
  const body: CollectionListResponse = { data: await listCollections() };
  res.json(body);
};
