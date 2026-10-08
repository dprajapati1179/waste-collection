export const MAX_WEIGHT_KG = 1000;

export type WeightValidation = { valid: true; value: number } | { valid: false; error: string };

export function validateWeight(input: string): WeightValidation {
  const normalized = input.trim().replace(',', '.');

  if (normalized === '') {
    return { valid: false, error: 'Enter the bag weight.' };
  }

  const value = Number(normalized);

  if (!Number.isFinite(value)) {
    return { valid: false, error: 'Enter a valid number.' };
  }
  if (value <= 0) {
    return { valid: false, error: 'Weight must be greater than 0.' };
  }
  if (value > MAX_WEIGHT_KG) {
    return { valid: false, error: `Weight cannot exceed ${MAX_WEIGHT_KG} kg.` };
  }
  if (/\.\d{3,}$/.test(normalized)) {
    return { valid: false, error: 'Use at most 2 decimal places.' };
  }

  return { valid: true, value };
}
