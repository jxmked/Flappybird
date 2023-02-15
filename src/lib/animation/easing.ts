export const swing = (progress: number): number => {
  return 0.5 - Math.cos(progress * Math.PI) / 2;
};

export const linear = (progress: number): number => {
  return progress;
};

export const quadratic = (progress: number): number => {
  return Math.pow(progress, 2);
};
