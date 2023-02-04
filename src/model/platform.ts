import { asset } from '../utils';
import platformImage from '../assets/sprites/base.png';
import { rescaleDim, IRescaleDim, lerp } from '../utils';

export default class Platform {
  velocity: IVelocity;
  coordinate: ICoordinate;
  canvasSize: IDimension;
  platformSize: IDimension;
  img: undefined | HTMLImageElement;

  constructor() {
    // Percentage
    this.velocity = { x: 0.001, y: 0 };
    this.coordinate = { x: 0, y: 0 };
    this.canvasSize = {
      width: 0,
      height: 0
    };
    this.platformSize = {
      width: 0,
      height: 0
    };
    this.img = void 0;
  }

  init() {
    this.img = asset(platformImage);
  }

  resize({ width, height }: IDimension): void {
    this.canvasSize.width = width;
    this.canvasSize.height = height;
    const max = Math.max(width, height);
    const div = 4;

    // Automatically resize the image based on highest dimension
    if (width > height) {
      this.platformSize = rescaleDim(
        {
          width: this.img!.width,
          height: this.img!.height
        },
        { width: max / div }
      );
    } else {
      this.platformSize = rescaleDim(
        {
          width: this.img!.width,
          height: this.img!.height
        },
        { height: max / div }
      );
    }

    this.coordinate.y = height - this.platformSize.height;
  }

  Update() {
    /**
     * We use linear interpolation instead of by pixel to move the object.
     * It is to keep the speed same in different Screen Sizes & Screen DPI
     * */
    this.coordinate.x += lerp(0, this.canvasSize.width, this.velocity.x);
    this.coordinate.y += this.velocity.y;
  }

  Display(context: CanvasRenderingContext2D) {
    const { width, height } = this.platformSize;
    const { x, y } = this.coordinate;
    const sequence = Math.ceil(this.canvasSize.width / width) + 1;
    const offset = x % width;

    for (let i = 0; i < sequence; i++) {
      context.drawImage(this.img!, i * width - offset, y, width, height);
    }
  }
}
