import { AbstractLoader } from './abstraction';

export interface IPromiseResolve {
  source: string;
  object: any;
}

export type ILoaders = new (source: string) => AbstractLoader;
