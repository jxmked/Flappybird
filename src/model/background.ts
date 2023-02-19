import { BG_SPEED, BG_TEXTURE } from '../constants';
import { lerp, rescaleDim } from '../utils';

import ParentClass from '../abstracts/parent-class';
import { asset } from '../lib/sprite-destructor';

export interface IBackgroundImages {
  day: HTMLImageElement;
  night: HTMLImageElement;
}

export default class Background extends ParentClass {
  /**
   * Background Image selection (Day & Night)
   * */
  private backgroundImage: IBackgroundImages;

  /**
   * background dimension.
   * */
  private backgroundSize: IDimension;

  /**
   * Current Image to be use
   * */
  private img: undefined | HTMLImageElement;

  constructor() {
    super();
    this.backgroundImage = {
      day: new Image(),
      night: new Image()
    };
    this.velocity.x = BG_SPEED;

    this.backgroundSize = {
      width: 0,
      height: 0
    };
    this.img = void 0;
  }

  /**
   * Initialize Images after all asset has been loaded
   * */
  public init(): void {
    this.backgroundImage = {
      night: asset('theme-night')!,
      day: asset('theme-day')!
    };

    this.use(BG_TEXTURE);
  }

  public reset(): void {
    this.coordinate = { x: 0, y: 0 };
    this.resize(this.canvasSize);
  }

  /**
   * Select either day and night
   * */
  public use(select: 'day' | 'night'): void {
    this.img = this.backgroundImage[select];
  }

  /**
   * Resize Background image while Keeping the same ratio
   * */
  public resize({ width, height }: IDimension): void {
    super.resize({ width, height });

    this.backgroundSize = rescaleDim(
      {
        width: this.img!.width,
        height: this.img!.height
      },
      { height }
    );
  }

  public Update(): void {
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

  public Display(context: CanvasRenderingContext2D): void {
    const { width, height } = this.backgroundSize;
    const { x, y } = this.coordinate;

    // Get how many sequence we need to fill the screen
    const sequence = Math.ceil(this.canvasSize.width / width) + 1;

    // Keep the images on screen.
    // X coordinate may gave us -99999999 values
    // But using modulo we're just getting -width of an image
    const offset = x % width;

    // Draw the background next to each other in given sequence
    for (let i = 0; i < sequence; i++) {
      context.drawImage(this.img!, i * width - offset, y, width, height);
    }
  }
}
