import { IPromiseResolve } from './interfaces';

class ParentLoader {
  private __source: string;
  protected ready: number; // Event to listen

  constructor(source: string) {
    this.__source = source;
    this.ready = 0;
  }

  protected eventTracking<T>(resolve: IEmptyFunction, object: T): void {
    this.ready--;

    if (this.ready < 1) {
      resolve({
        source: this.source,
        object: object
      });
    }
  }

  public get source(): string {
    return this.__source;
  }
}

/**
 * Making Parent Class to be extendable only
 * */
abstract class Loader extends ParentLoader {
  public static regexp: RegExp;
  public abstract test(): boolean;
  public abstract load(): Promise<IPromiseResolve>;
}

export { Loader as AbstractLoader };
