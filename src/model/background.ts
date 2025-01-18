import { BG_SPEED } from '../constants';
import { rescaleDim } from '../utils';
import ParentClass from '../abstracts/parent-class';
import SpriteDestructor from '../lib/sprite-destructor';
import SceneGenerator from './scene-generator';

export type ITheme = string;
export type IRecords = Map<ITheme, HTMLImageElement>;
export default class Background extends ParentClass {
  /**
   * background dimension.
   * */
  private backgroundSize: IDimension;

  private images: IRecords;
  private theme: ITheme;

  constructor() {
    super();
    this.images = new Map<ITheme, HTMLImageElement>();
    this.theme = 'day';

    this.velocity.x = BG_SPEED;

    this.backgroundSize = {
      width: 0,
      height: 0
    };
  }

  /**
   * Initialize Images after all asset has been loaded
   * */
  public init(): void {
    this.images.set('day', SpriteDestructor.asset('theme-day'));
    this.images.set('night', SpriteDestructor.asset('theme-night'));

    Object.assign(SceneGenerator.bgThemeList, ['day', 'night']);
    this.use(SceneGenerator.background);
  }

  public reset(): void {
    this.coordinate = { x: 0, y: 0 };
    this.resize(this.canvasSize);
    this.use(SceneGenerator.background);
  }

  /**
   * Select either day and night
   * */
  public use(select: ITheme): void {
    this.theme = select;
  }

  /**
   * Resize Background image while Keeping the same ratio
   * */
  public resize({ width, height }: IDimension): void {
    super.resize({ width, height });

    this.backgroundSize = rescaleDim(
      {
        width: this.images.get(this.theme)!.width,
        height: this.images.get(this.theme)!.height
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
    this.coordinate.x += this.canvasSize.width * this.velocity.x;
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
      context.drawImage(
        this.images.get(this.theme)!,
        i * (width - i) - offset,
        y,
        width,
        height
      );
    }
  }
}
