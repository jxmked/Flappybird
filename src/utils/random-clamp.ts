/**
 * A clamping function that accepts two parameters (min, max) and
 * returns a random number in between.
 *
 * @param min Minimum Number
 * @param max Max Number
 * @returns Random Number between min and max
 */

export const randomClamp = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};
