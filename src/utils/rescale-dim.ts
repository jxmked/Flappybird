/**
 * A function that automatically rescale the given dimension and
 * returns new scaled dimension.
 *
 * @param oldDim - Initial {width, height} dimension.
 * @param newDim - New Dimension to match width. Its either { width } or { height } but cannot both.
 */
export type IRescaleDim = { width: number } | { height: number };

export const rescaleDim = (oldDim: IDimension, newDim: IRescaleDim): IDimension => {
  const filledDim: IDimension = {
    width: 0,
    height: 0
  };

  if ('width' in newDim) {
    filledDim.width = newDim.width;
    filledDim.height = (oldDim.height / oldDim.width) * newDim.width;
  } else if ('height' in newDim) {
    filledDim.height = newDim.height;
    filledDim.width = (oldDim.width * newDim.height) / oldDim.height;
  }

  return filledDim;
};
