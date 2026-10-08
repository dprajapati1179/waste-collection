import { createApp } from './app';
import { env } from './config/env';

createApp().listen(env.PORT, () => {
  console.info(`API listening on http://localhost:${env.PORT}`);
});
