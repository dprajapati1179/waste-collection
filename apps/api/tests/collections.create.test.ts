import request from 'supertest';

import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';
import { buildPayload, resetDatabase } from './helpers';

const app = createApp();
const post = (body: unknown) =>
  request(app)
    .post('/collections')
    .send(body as object);

beforeEach(resetDatabase);
afterAll(() => prisma.$disconnect());

describe('POST /collections', () => {
  it('creates a collection and returns it', async () => {
    const res = await post(buildPayload());

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual({
      id: expect.any(String),
      qr_id: 'BAG-1001',
      weight: 12.5,
      points: 188,
      timestamp: '2026-10-08T10:30:00.000Z',
      created_at: expect.any(String),
    });
  });

  it('persists the collection', async () => {
    await post(buildPayload({ qr_id: 'BAG-2002', weight: 4 }));

    const saved = await prisma.collection.findUnique({ where: { qrId: 'BAG-2002' } });
    expect(saved).toMatchObject({ weight: 4, points: 60 });
  });

  it.each([
    [1, 15],
    [12.5, 188],
    [0.01, 0],
    [2.33, 35],
  ])('allocates points for %d kg as %d', async (weight, points) => {
    const res = await post(buildPayload({ weight }));

    expect(res.status).toBe(201);
    expect(res.body.data.points).toBe(points);
  });

  it('trims the qr_id before saving', async () => {
    const res = await post(buildPayload({ qr_id: '  BAG-3003  ' }));

    expect(res.body.data.qr_id).toBe('BAG-3003');
  });

  describe('validation', () => {
    it.each([
      ['missing qr_id', { qr_id: undefined }, 'qr_id'],
      ['empty qr_id', { qr_id: '   ' }, 'qr_id'],
      ['non-string qr_id', { qr_id: 123 }, 'qr_id'],
      ['missing weight', { weight: undefined }, 'weight'],
      ['string weight', { weight: '12.5' }, 'weight'],
      ['zero weight', { weight: 0 }, 'weight'],
      ['negative weight', { weight: -3 }, 'weight'],
      ['weight above the limit', { weight: 1000.5 }, 'weight'],
      ['weight with more than 2 decimals', { weight: 1.234 }, 'weight'],
      ['invalid timestamp', { timestamp: 'yesterday' }, 'timestamp'],
      ['future timestamp', { timestamp: '2999-01-01T00:00:00.000Z' }, 'timestamp'],
      ['client supplied points', { points: 9999 }, 'points'],
    ])('rejects %s', async (_case, overrides, field) => {
      const res = await post(buildPayload(overrides));

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ field })]),
      );
      expect(await prisma.collection.count()).toBe(0);
    });

    it('rejects malformed JSON', async () => {
      const res = await request(app)
        .post('/collections')
        .set('Content-Type', 'application/json')
        .send('{"qr_id":');

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('duplicates', () => {
    it('returns 409 when the qr_id was already collected', async () => {
      await post(buildPayload());
      const res = await post(buildPayload({ weight: 3 }));

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('DUPLICATE_COLLECTION');
      expect(await prisma.collection.count()).toBe(1);
    });

    it('accepts only one of two simultaneous submissions', async () => {
      const results = await Promise.all([post(buildPayload()), post(buildPayload())]);

      expect(results.map((res) => res.status).sort()).toEqual([201, 409]);
      expect(await prisma.collection.count()).toBe(1);
    });
  });
});
