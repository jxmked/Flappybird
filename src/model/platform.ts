import ParentClass from '../abstracts/parent-class';

import { asset } from '../utils';
import platformImage from '../assets/sprites/base.png';
import { rescaleDim, lerp } from '../utils';
import { GAME_SPEED } from '../constants';

export default class Platform extends ParentClass {
  platformSize: IDimension;
  img: undefined | HTMLImageElement;

  constructor() {
    super();
    this.velocity.x = GAME_SPEED;
    this.platformSize = {
      width: 0,
      height: 0
    };
    this.img = void 0;
  }

  init() {
    this.img = asset(platformImage as string) as HTMLImageElement;
  }

  resize({ width, height }: IDimension): void {
    super.resize({ width, height });

    this.platformSize = rescaleDim(
      {
        width: this.img!.width,
        height: this.img!.height
      },
      { height: height / 4 }
    );

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
    /**
     * Similar to the background but drawing the image into bottom of screen
     * */
    const { width, height } = this.platformSize;
    const { x, y } = this.coordinate;
    const sequence = Math.ceil(this.canvasSize.width / width) + 1;
    const offset = x % width;

    for (let i = 0; i < sequence; i++) {
      context.drawImage(this.img!, i * width - offset, y, width, height);
    }
  }
}
