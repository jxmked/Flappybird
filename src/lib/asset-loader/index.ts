import AudioLoader from './loaders/audio';
import ImageLoader from './loaders/image';
import { IPromiseResolve, ILoaders } from './interfaces';

export type IAssets = HTMLImageElement | HTMLAudioElement;

export default class AssetsLoader {
  private static assets: Map<string, IAssets> = new Map<string, IAssets>();
  private callback?: IEmptyFunction;
  private static loaders: ILoaders[] = [AudioLoader, ImageLoader];

  constructor(sources: string[]) {
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
          AssetsLoader.assets.set(resolve.source, resolve.object as IAssets);
        });

        this.callback?.();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Call the instance function after all assets has been loaded
  then(callback: IEmptyFunction): void {
    this.callback = callback;
  }

  static get<T>(source: string): T {
    return AssetsLoader.assets.get(source) as T;
  }
}

// export const asset = AssetsLoader.get;
