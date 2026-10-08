import { Router } from 'express';

import { postCollection } from '../controllers/collection.controller';

export const collectionRouter = Router();

collectionRouter.post('/', postCollection);
