/**
 * f(x) = A • sin(((t / 1000) • 2 • PI) / (1 / B))
 *
 * where A is the Amplitude
 *       B is the Frequency
 *       t is time
 *
 * */

/**
 * Return wave value based on time using sine
 * */
export const sine = (frequency: number, amplitude: number): number => {
  const time = new Date().getTime();
  return Math.sin(((time / 1000) * 2 * Math.PI) / (1 / frequency)) * amplitude;
};

/**
 * Return wave value based on time using cosine. Its your choice
 * */
export const cosine = (frequency: number, amplitude: number): number => {
  const time = new Date().getTime();
  return Math.sin(((time / 1000) * 2 * Math.PI) / (1 / frequency)) * amplitude;
};
