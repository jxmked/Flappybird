import { rescaleDim } from '../utils';

import { GAME_SPEED } from '../constants';
import ParentClass from '../abstracts/parent-class';
import SpriteDestructor from '../lib/sprite-destructor';

export default class Platform extends ParentClass {
  public platformSize: IDimension;
  private img: undefined | HTMLImageElement;

  constructor() {
    super();
    this.velocity.x = GAME_SPEED;
    this.platformSize = {
      width: 0,
      height: 0
    };
    this.img = void 0;
  }

  public init() {
    this.img = SpriteDestructor.asset('platform');
  }

  public reset(): void {
    this.coordinate = { x: 0, y: 0 };
    this.resize(this.canvasSize);
  }

  public resize({ width, height }: IDimension): void {
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

  public Update() {
    /**
     * We use linear interpolation instead of by pixel to move the object.
     * It is to keep the speed same in different Screen Sizes & Screen DPI
     * */
    this.coordinate.x += this.canvasSize.width * this.velocity.x;
    this.coordinate.y += this.velocity.y;
  }

  public Display(context: CanvasRenderingContext2D) {
    /**
     * Similar to the background but drawing the image into bottom of screen
     * */
    const { width, height } = this.platformSize;
    const { x, y } = this.coordinate;
    const sequence = Math.ceil(this.canvasSize.width / width) + 1;
    const offset = x % width;

    for (let i = 0; i < sequence; i++) {
      context.drawImage(this.img!, i * (width - i) - offset, y, width, height);
    }
  }
}
