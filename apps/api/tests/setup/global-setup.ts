import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import path from 'node:path';

import { TEST_DATABASE_URL } from './env';

export default function globalSetup() {
  const apiRoot = path.resolve(__dirname, '../..');
  rmSync(path.join(apiRoot, 'test.db'), { force: true });
  execSync('npx prisma migrate deploy', {
    cwd: apiRoot,
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
    stdio: 'ignore',
  });
}
