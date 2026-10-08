import { calculatePoints, POINTS_PER_KG } from '../src/services/points';

describe('calculatePoints', () => {
  it('awards 15 points per kg', () => {
    expect(POINTS_PER_KG).toBe(15);
    expect(calculatePoints(10)).toBe(150);
  });

  it('rounds to the nearest whole point', () => {
    expect(calculatePoints(12.5)).toBe(188);
    expect(calculatePoints(0.03)).toBe(0);
    expect(calculatePoints(0.04)).toBe(1);
  });
});
