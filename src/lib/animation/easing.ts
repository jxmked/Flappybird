export interface IEasingUtils {
  swing: (progress: number) => number;
  linear: (progress: number) => number;
  quadratic: (progress: number) => number;
  cubicBezierCurve: (progress: number) => number;
}

export type IEasingKey = keyof IEasingUtils;

export const swing: IEasingUtils['swing'] = (progress: number): number => {
  /**
   * f(x) = 1/2 - cos(x • PI)/2
   * */
  return 0.5 - Math.cos(progress * Math.PI) / 2;
};

export const linear: IEasingUtils['linear'] = (progress: number): number => {
  /**
   * f(x) = x
   * */
  return progress;
};

export const quadratic: IEasingUtils['quadratic'] = (progress: number): number => {
  /**
   * f(x) = x^2
   * */
  return Math.pow(progress, 2);
};

export const cubicBezierCurve: IEasingUtils['cubicBezierCurve'] = (
  progress: number
): number => {
  /**
   * f(x) = { 2x^3, x <= 0.5,
   *        { 1 - 2x^3 > 0.5
   * */

  return progress <= 0.5 ? 2 * Math.pow(progress, 3) : 1 - 2 * Math.pow(progress, 3);
};
