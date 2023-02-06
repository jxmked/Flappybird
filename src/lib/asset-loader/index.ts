import AudioLoader from './loaders/audio';
import ImageLoader from './loaders/image';
import { IPromiseResolve, ILoaders } from './interfaces';

export default class AssetsLoader {
  private static assets: Map<string, any> = new Map<string, any>();
  private callback: Function;
  private static loaders: ILoaders[] = [AudioLoader, ImageLoader];

  constructor(sources: string[]) {
    this.callback = () => {};

    const InitializeLoad = sources.map((source: string) => {
      for (const loader of AssetsLoader.loaders) {
        const instance = new loader(source);

        if (instance.test()) {
          return instance.load();
        }
      }

      /**
       * Throw if no available driver to handle the requests
       * */

      throw new Error('No available driver for file: ' + source);
    });

    Promise.all(InitializeLoad)
      .then((resolveArray: IPromiseResolve[]) => {
        resolveArray.forEach((resolve: IPromiseResolve) => {
          AssetsLoader.assets.set(resolve['source'], resolve['object']);
        });

        this.callback();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Call the instance function after all assets has been loaded
  then(callback: Function): void {
    this.callback = callback;
  }

  static get(source: string): any {
    return AssetsLoader.assets.get(source);
  }
}

export const asset = AssetsLoader.get;
