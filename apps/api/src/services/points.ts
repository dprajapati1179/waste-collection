export const POINTS_PER_KG = 15;

export function calculatePoints(weightKg: number): number {
  return Math.round(weightKg * POINTS_PER_KG);
}
