import { IPromiseResolve } from '../interfaces';
import { AbstractLoader } from '../abstraction';

export default class AudioLoader extends AbstractLoader {
  public static regexp = /\.(mp3|wav|ogg|aac)/i;

  public test(): boolean {
    return AudioLoader.regexp.test(this.source);
  }

  public load(): Promise<IPromiseResolve> {
    // Load Event Count
    this.ready = 2;

    return new Promise<IPromiseResolve>((resolve: IEmptyFunction, reject) => {
      const audio = new Audio();

      /**
       * Fully loaded
       * */
      audio.addEventListener('load', () => {
        this.eventTracking<HTMLAudioElement>(resolve, audio);
      });

      /**
       * Can Play Without bufferring
       * */
      audio.addEventListener('canplay', () => {
        this.eventTracking<HTMLAudioElement>(resolve, audio);
      });

      /**
       * Can Play Without Interruptions
       * */
      audio.addEventListener('canplaythrough', () => {
        this.eventTracking<HTMLAudioElement>(resolve, audio);
      });

      audio.addEventListener('error', reject);

      audio.src = this.source;
    });
  }
}
