import request from 'supertest';

import { createApp } from '../src/app';

const app = createApp();

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('unknown routes', () => {
  it('returns a 404 error response', async () => {
    const res = await request(app).get('/missing');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
