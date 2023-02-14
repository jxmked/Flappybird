/**
 * A sprite destructor
 * */

export interface IPromiseImageHandled {
  name: string;
  img: HTMLImageElement;
}

export default class SpriteDestructor {
  // Virtuals
  static Canvas = document.createElement('canvas');
  ctx: CanvasRenderingContext2D;

  /**
   * Cache for later use
   * */
  static cached: Map<string, HTMLImageElement> = new Map<string, HTMLImageElement>();

  sprite: HTMLImageElement;
  loading: Promise<IPromiseImageHandled>[];

  constructor(img: HTMLImageElement) {
    this.sprite = img;
    this.ctx = SpriteDestructor.Canvas.getContext('2d')!;
    this.loading = [];
  }

  then(callback: Function): void {
    Promise.all(this.loading).then((resolved: IPromiseImageHandled[]) => {
      resolved.forEach(({ name, img }) => SpriteDestructor.cached.set(name, img));
      callback();
    });
  }

  static asset(key: string): HTMLImageElement | undefined {
    return SpriteDestructor.cached.get(key);
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

  private feedImage(name: string) {
    /**
     * Load the cutout image then push it into promse handler
     * */
    this.loading.push(
      new Promise<IPromiseImageHandled>((resolve: Function, reject: Function) => {
        const img = new Image();
        img.src = SpriteDestructor.Canvas.toDataURL();
        img.addEventListener('load', () => resolve({ name, img }));
        img.addEventListener('error', (err) => reject(err));
      })
    );
  }
}

export const asset = SpriteDestructor.asset;
