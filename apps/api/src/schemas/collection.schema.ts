import { z } from 'zod';

const MAX_WEIGHT_KG = 1000;
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

const hasAtMostTwoDecimals = (value: number) =>
  Math.abs(value * 100 - Math.round(value * 100)) < 1e-9;

export const createCollectionSchema = z.strictObject({
  qr_id: z
    .string({ error: 'qr_id is required' })
    .trim()
    .min(1, 'qr_id cannot be empty')
    .max(128, 'qr_id cannot exceed 128 characters'),
  weight: z
    .number({ error: 'weight must be a number' })
    .positive('weight must be greater than 0')
    .max(MAX_WEIGHT_KG, `weight cannot exceed ${MAX_WEIGHT_KG} kg`)
    .refine(hasAtMostTwoDecimals, 'weight can have at most 2 decimal places'),
  timestamp: z.iso
    .datetime({ offset: true, error: 'timestamp must be an ISO 8601 date-time' })
    .refine((value) => {
      const time = Date.parse(value);
      return Number.isNaN(time) || time <= Date.now() + MAX_CLOCK_SKEW_MS;
    }, 'timestamp cannot be in the future'),
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
