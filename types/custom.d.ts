interface IDimension {
  width: number;
  height: number;
}

interface ICoordinate {
  x: number;
  y: number;
}

interface IVelocity {
  x: number;
  y: number;
}

type IEmptyFunction = (...args) => void;
