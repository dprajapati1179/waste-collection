import { Prisma, type Collection } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';

export class DuplicateQrIdError extends Error {
  constructor(readonly qrId: string) {
    super(`Collection with qr_id ${qrId} already exists`);
    this.name = 'DuplicateQrIdError';
  }
}

interface NewCollection {
  qrId: string;
  weight: number;
  points: number;
  timestamp: Date;
}

export async function insertCollection(data: NewCollection): Promise<Collection> {
  try {
    return await prisma.collection.create({ data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new DuplicateQrIdError(data.qrId);
    }
    throw err;
  }
}
