import DefaultProps from './default-properties';
import { IEasingKey } from '../easing';
import * as easing from '../easing';

export interface IFadingOptions {
  duration: number;
  transition: IEasingKey;
}

export interface IConstructorFadingOptions extends Partial<IFadingOptions> {}

export interface IFadingStatus {
  running: boolean;
  complete: boolean;
}

export default abstract class Fading extends DefaultProps {
  protected options: IFadingOptions;

  constructor(options?: IConstructorFadingOptions) {
    super();
    this.options = {
      duration: 500, // ms
      transition: 'swing'
    };

    Object.assign(this.options, options ?? {});
  }

  public get status(): IFadingStatus {
    return {
      running: this.isRunning,
      complete: this.isComplete
    };
  }

  protected inUseTransition(num: number): number {
    return easing[this.options.transition](num);
  }

  public abstract get value(): number;
}
