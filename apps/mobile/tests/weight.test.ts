import { validateWeight } from '../src/utils/weight';

describe('validateWeight', () => {
  it.each(['', '  ', '0', '0.00', '-5', 'abc', '1000.01', '1.234'])('rejects %p', (input) => {
    expect(validateWeight(input).valid).toBe(false);
  });

  it.each([
    ['12.5', 12.5],
    ['2,5', 2.5],
    ['0.01', 0.01],
    ['1000', 1000],
  ])('accepts %p as %d', (input, value) => {
    expect(validateWeight(input)).toEqual({ valid: true, value });
  });
});
