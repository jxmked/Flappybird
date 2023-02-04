import { asset } from '../utils';
import bgImgDay from '../assets/sprites/background/day.png';
import bgImgNight from '../assets/sprites/background/night.png';
import { rescaleDim, IRescaleDim } from '../utils';

export default class Background {
  backgroundImage: { [key: string]: HTMLImageElement };
  velocity: IVelocity;
  coordinate: ICoordinate;
  canvasSize: IDimension;
  backgroundSize: IDimension;
  img: undefined | HTMLImageElement;

  constructor() {
    this.backgroundImage = {};
    this.velocity = { x: 0.4, y: 0 };
    this.coordinate = { x: 0, y: 0 };
    this.canvasSize = {
      width: 0,
      height: 0
    };
    this.backgroundSize = {
      width: 0,
      height: 0
    };
    this.img = void 0;
  }

  init() {
    this.backgroundImage = {
      night: asset(bgImgNight),
      day: asset(bgImgDay)
    };

    this.use('night');
  }

  use(select: 'day' | 'night'): void {
    this.img = this.backgroundImage[select as keyof typeof this.backgroundImage];
  }

  resize({ width, height }: IDimension): void {
    // height = height / 1.1;
    this.canvasSize.width = width;
    this.canvasSize.height = height;
    const max = Math.max(width, height);

    // Automatically resize the image based on highest dimension
    if (width < height) {
      this.backgroundSize = rescaleDim(
        {
          width: this.img!.width,
          height: this.img!.height
        },
        { height: max }
      );
    } else {
      this.backgroundSize = rescaleDim(
        {
          width: this.img!.width,
          height: this.img!.height
        },
        { width: max }
      );
    }

    console.log(this.backgroundSize);
  }

  Update() {
    this.coordinate.x += this.velocity.x;
    this.coordinate.y += this.velocity.y;
  }

  Display(context: CanvasRenderingContext2D) {
    const { width, height } = this.backgroundSize;
    const { x, y } = this.coordinate;
    const sequence = Math.ceil(this.canvasSize.width / width) + 1;
    const offset = x % width;

    for (let i = 0; i < sequence; i++) {
      context.drawImage(this.img!, i * width - offset, y, width, height);
    }
  }
}
