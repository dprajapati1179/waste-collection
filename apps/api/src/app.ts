import express from 'express';

import { errorHandler, notFoundHandler } from './errors/handlers';
import { healthRouter } from './routes/health.routes';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb' }));

  app.use('/health', healthRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
