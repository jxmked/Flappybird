/**
 * A clamping functions that checks the last parameter if is equal
 * or in between of min and max number from first and second parameter
 *
 * @param min - Minimum number
 * @param max - Maximum number
 * @param value - A number value to clamp
 */
export const clamp = (min: number, max: number, value: number): number => {
  return Math.max(Math.min(value, max), min);
};
