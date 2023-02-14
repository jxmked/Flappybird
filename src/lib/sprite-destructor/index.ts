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
  private static Canvas = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D;

  /**
   * Cache for later use
   * */
  private static cached: Map<string, HTMLImageElement> = new Map<
    string,
    HTMLImageElement
  >();

  private sprite: HTMLImageElement;
  private loading: Promise<IPromiseImageHandled>[];

  private cb_modify: ICallbackModify;

  constructor(img: HTMLImageElement) {
    this.sprite = img;
    this.ctx = SpriteDestructor.Canvas.getContext('2d')!;
    this.loading = [];
    this.cb_modify = (name: string, img: HTMLImageElement) => Promise.resolve(img);
  }

  public then(callback: Function): void {
    Promise.all(this.loading).then((resolved: IPromiseImageHandled[]) => {
      resolved.forEach(({ name, img }) => SpriteDestructor.cached.set(name, img));
      callback();
    });
  }

  public static asset(key: string): HTMLImageElement {
    if (SpriteDestructor.cached.has(key)) return SpriteDestructor.cached.get(key)!;

    throw new TypeError(`Key: ${key} does not defined on SpriteDestructor`);
  }

  /**
   * If you need
   * */
  public modify(callback: ICallbackModify): void {
    this.cb_modify = callback;
  }

  public cutOut(name: string, sx: number, sy: number, dx: number, dy: number): void {
    // Resize the canvas based on cutout image
    SpriteDestructor.Canvas.width = dx;
    SpriteDestructor.Canvas.height = dy;

    this.ctx.clearRect(0, 0, dx, dy);

    // Disable image Smoothing & use the highest possible image
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.imageSmoothingQuality = 'high';

    // Draw
    this.ctx.drawImage(this.sprite, sx, sy, dx, dy, 0, 0, dx, dy);
    this.feedImage(name);
  }

  private feedImage(name: string): void {
    /**
     * Load the cutout image then push it into promse handler
     * */
    this.loading.push(
      new Promise<IPromiseImageHandled>((resolve: Function, reject: Function) => {
        const img = new Image();
        img.src = SpriteDestructor.Canvas.toDataURL();
        img.addEventListener('load', async () => {
          resolve({ name, img: await this.cb_modify(name, img) });
        });
        img.addEventListener('error', (err) => reject(err));
      })
    );
  }
}

export const asset = SpriteDestructor.asset;
