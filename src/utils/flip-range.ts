/**
 * Flip the range. Min becomes max and max becomes min
 * */
export const flipRange = (min: number, max: number, value: number): number => {
  return max - (value - min);
};
