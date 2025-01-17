import { IPromiseResolve } from '../interfaces';
import { AbstractLoader } from '../abstraction';

export default class ImageLoader extends AbstractLoader {
  public static regexp = /\.(jpe?g|png|svg|bmp|webp|webm|gif)/i;

  public test(): boolean {
    return ImageLoader.regexp.test(this.source);
  }

  public load(): Promise<IPromiseResolve> {
    // Load Event Count
    this.ready = 1;

    return new Promise<IPromiseResolve>((resolve: IEmptyFunction, reject) => {
      const img = new Image();

      /**
       * Fully loaded
       * */
      img.addEventListener('load', () => {
        this.eventTracking<HTMLImageElement>(resolve, img);
      });

      img.addEventListener('error', reject);

      img.src = this.source;
    });
  }
}
