import ParentClass from '../abstracts/parent-class';

import { asset } from '../utils';
import bgImgDay from '../assets/sprites/background/day.png';
import bgImgNight from '../assets/sprites/background/night.png';
import { rescaleDim, IRescaleDim, lerp } from '../utils';

// prettier-ignore
import {
  BG_SPEED
} from '../constants';

export default class Background extends ParentClass {
  backgroundImage: { [key: string]: HTMLImageElement };
  backgroundSize: IDimension;
  img: undefined | HTMLImageElement;

  constructor() {
    super();
    this.backgroundImage = {};
    this.velocity.x = BG_SPEED;

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
    super.resize({ width, height });

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
  }

  Update() {
    /**
     * We use linear interpolation instead of by pixel to move the object.
     * It is to keep the speed same in different Screen Sizes & Screen DPI.
     *
     * The only problem that left is the time difference.
     * We cannot rely on fps since it is not a constant value.
     * Which means is the game will speed up or slow down based on fps
     * */
    this.coordinate.x += lerp(0, this.canvasSize.width, this.velocity.x);
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
