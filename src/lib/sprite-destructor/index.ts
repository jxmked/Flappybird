/**
 * A sprite destructor
 * */

export interface IPromiseImageHandled {
  name: string;
  img: HTMLImageElement;
}

export type ICallbackModify = (
  name: string,
  img: HTMLImageElement
) => Promise<HTMLImageElement>;

export default class SpriteDestructor {
  // Virtuals
  private readonly Canvas = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D;

  /**
   * Cache for later use
   * */
  private static readonly cached = new Map<string, HTMLImageElement>();

  private loading: Promise<IPromiseImageHandled>[];

  private then_called: boolean;
  // private cutout_call_count: number;

  constructor(private sprite: HTMLImageElement) {
    this.ctx = this.Canvas.getContext('2d')!;
    this.loading = [];
    this.then_called = false;
    // this.cutout_call_count = 0;
  }

  public async then(callback: IEmptyFunction): Promise<void> {
    if (this.then_called) return;
    this.then_called = true;

    await Promise.allSettled(this.loading).then(
      (resolved: PromiseSettledResult<IPromiseImageHandled>[]) => {
        let error_count = 0;

        for (const result of resolved) {
          if (result.status === 'fulfilled' && 'value' in result) {
            SpriteDestructor.cached.set(result.value.name, result.value.img);
            continue;
          }
          ++error_count;
        }

        // console.info(
        //   `Does match with cutout: ${this.cutout_call_count === resolved.length}`
        // );
        console.warn(`Error count: ${error_count}`);

        callback();
      }
    );
  }

  public static asset(key: string): HTMLImageElement {
    if (SpriteDestructor.cached.has(key)) return SpriteDestructor.cached.get(key)!;

    throw new TypeError(`Key: ${key} does not defined on SpriteDestructor`);
  }

  public cutOut(name: string, sx: number, sy: number, dx: number, dy: number): void {
    // Resize the canvas based on cutout image
    this.Canvas.width = dx;
    this.Canvas.height = dy;

    this.ctx.clearRect(0, 0, dx, dy);

    // Disable image Smoothing
    this.ctx.imageSmoothingEnabled = false;

    // Draw
    this.ctx.drawImage(this.sprite, sx, sy, dx, dy, 0, 0, dx, dy);

    this.feedImage(name);
  }

  private feedImage(name: string): void {
    /**
     * Load the cutout image then push it into promse handler
     * */
    this.loading.push(
      new Promise<IPromiseImageHandled>(
        (resolve: IEmptyFunction, reject: IEmptyFunction) => {
          const img = new Image();
          img.src = this.Canvas.toDataURL();
          img.addEventListener('load', () => resolve({ name, img }));
          img.addEventListener('error', (err) => reject(err));
        }
      )
    );

    // this.cutout_call_count++;
  }
}
