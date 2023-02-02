import { IPromiseResolve } from '../interfaces';
import { AbstractLoader } from '../abstraction';

export default class ImageLoader extends AbstractLoader {
  static regexp: RegExp = /\.(jpe?g|png|svg|bmp|webp|webm|gif)/i;

  test(): boolean {
    return ImageLoader.regexp.test(this.source);
  }

  load(): Promise<IPromiseResolve> {
    // Load Event Count
    this.ready = 1;

    return new Promise<IPromiseResolve>((resolve: Function, reject) => {
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
