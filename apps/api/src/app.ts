import express from 'express';

import { errorHandler, notFoundHandler } from './errors/handlers';
import { collectionRouter } from './routes/collection.routes';
import { healthRouter } from './routes/health.routes';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb' }));

  app.use('/health', healthRouter);
  app.use('/collections', collectionRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
