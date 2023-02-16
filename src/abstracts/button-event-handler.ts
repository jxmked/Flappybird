export interface IMouseProperties {
  coordinate: ICoordinate;
  isPressed: boolean;
}

class ButtonEventHandler {
  size: number;
  coordinate: ICoordinate;
  dimension: IDimension;
  isPressed: boolean;
  mouse: IMouseProperties;

  constructor() {
    this.size = 0;
    this.coordinate = {
      x: 0,
      y: 0
    };
    this.dimension = {
      width: 0,
      height: 0
    };
    this.isPressed = false;
    this.mouse = {
      coordinate: {
        x: 0,
        y: 0
      },
      isPressed: false
    };
  }
}

export default abstract class ButtonEventHandlerClass extends ButtonEventHandler {
  constructor() {
    super();
  }
}
