import { IPromiseResolve } from './interfaces';

class ParentLoader {
  private __source: string;
  protected ready: number; // Event to listen

  constructor(source: string) {
    this.__source = source;
    this.ready = 0;
  }

  eventTracking<T>(resolve: Function, object: T): void {
    this.ready--;

    if (this.ready < 1) {
      resolve({
        source: this.source,
        object: object
      });
    }
  }

  get source(): string {
    return this.__source;
  }
}

/**
 * Making Parent Class to be extendable only
 * */
abstract class Loader extends ParentLoader {
  static regexp: RegExp;
  abstract test(): boolean;
  public abstract load(): Promise<IPromiseResolve>;
}

export { Loader as AbstractLoader };
