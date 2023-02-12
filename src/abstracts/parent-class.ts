class ParentObject {
  canvasSize: IDimension;
  velocity: IVelocity;
  coordinate: ICoordinate;

  constructor() {
    this.canvasSize = {
      width: 0,
      height: 0
    };

    this.velocity = {
      x: 0,
      y: 0
    };

    this.coordinate = {
      x: 0,
      y: 0
    };
  }

  resize({ width, height }: IDimension): void {
    this.canvasSize = { width, height };
  }
}

export default abstract class ParentClass extends ParentObject {
  abstract Update(): void;
  abstract Display(context: CanvasRenderingContext2D): void;
  abstract init(): void;
}
