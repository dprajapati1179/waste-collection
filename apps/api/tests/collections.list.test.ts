import request from 'supertest';

import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';
import * as repository from '../src/repositories/collection.repository';
import { resetDatabase } from './helpers';

const app = createApp();

beforeEach(resetDatabase);
afterEach(() => jest.restoreAllMocks());
afterAll(() => prisma.$disconnect());

describe('GET /collections', () => {
  it('returns an empty list when nothing has been collected', async () => {
    const res = await request(app).get('/collections');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [] });
  });

  it('returns collections with all fields', async () => {
    await request(app)
      .post('/collections')
      .send({ qr_id: 'BAG-1', weight: 2.5, timestamp: '2026-10-08T09:00:00.000Z' });

    const res = await request(app).get('/collections');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([
      {
        id: expect.any(String),
        qr_id: 'BAG-1',
        weight: 2.5,
        points: 38,
        timestamp: '2026-10-08T09:00:00.000Z',
        created_at: expect.any(String),
      },
    ]);
  });

  it('orders collections newest first', async () => {
    const timestamp = new Date('2026-10-08T08:00:00.000Z');
    await prisma.collection.createMany({
      data: [
        {
          qrId: 'BAG-OLD',
          weight: 1,
          points: 15,
          timestamp,
          createdAt: new Date('2026-10-08T10:00:00Z'),
        },
        {
          qrId: 'BAG-NEW',
          weight: 1,
          points: 15,
          timestamp,
          createdAt: new Date('2026-10-08T12:00:00Z'),
        },
        {
          qrId: 'BAG-MID',
          weight: 1,
          points: 15,
          timestamp,
          createdAt: new Date('2026-10-08T11:00:00Z'),
        },
      ],
    });

    const res = await request(app).get('/collections');

    expect(res.body.data.map((item: { qr_id: string }) => item.qr_id)).toEqual([
      'BAG-NEW',
      'BAG-MID',
      'BAG-OLD',
    ]);
  });

  it('returns a generic 500 when the database fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest
      .spyOn(repository, 'findAllCollections')
      .mockRejectedValueOnce(new Error('SQLITE_BUSY: database is locked'));

    const res = await request(app).get('/collections');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
    });
  });
});
