type IRescaleDim = { width: number } | { height: number };

const rescaleDim = (oldDim: IDimension, newDim: IRescaleDim): IDimension => {
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

export { rescaleDim, IRescaleDim };
