import IDefaultProperties from './default-properties';
import { IEasingKey } from '../easing';
import * as easing from '../easing';

export interface IFlyingOption {
  duration: number;
  transition: IEasingKey;
  from: ICoordinate;
  to: ICoordinate;
}

export interface IFlyingContructorOption
  extends Omit<IFlyingOption, 'transition' | 'duration'> {
  duration?: number;
  transition?: IEasingKey;
}

export interface IFlyingStatus {
  running: boolean;
  complete: boolean;
}

export default abstract class Flying extends IDefaultProperties {
  protected options: IFlyingOption;

  constructor(options: IFlyingContructorOption) {
    super();
    this.options = {
      duration: 500,
      from: {
        x: 0,
        y: 0
      },
      to: {
        x: 0,
        y: 0
      },
      transition: 'cubicBezier'
    };

    Object.assign(this.options, options);
  }

  public get status(): IFlyingStatus {
    return {
      running: this.isRunning,
      complete: this.isComplete
    };
  }

  protected inUseTransition(num: number): number {
    return easing[this.options.transition](num);
  }

  public abstract get value(): ICoordinate;
}
