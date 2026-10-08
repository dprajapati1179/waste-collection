import { Router } from 'express';

import { getCollections, postCollection } from '../controllers/collection.controller';

export const collectionRouter = Router();

collectionRouter.get('/', getCollections);
collectionRouter.post('/', postCollection);
