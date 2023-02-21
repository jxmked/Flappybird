/**
 * I did include this Timing event into animation
 * since it will animate the numbers
 * */

import DefaultProps from '../abstracts/default-properties';

export interface ITimingEventOptions {
  diff: number; // Interval per number
}

export interface ITimingEventOptionsConstructor extends Partial<ITimingEventOptions> {}

export interface ITimingEventStatus {
  running: boolean;
  complete: boolean;
}

export class TimingEvent extends DefaultProps {
  private options: ITimingEventOptions;

  constructor(options?: ITimingEventOptionsConstructor) {
    super();
    this.options = {
      diff: 100
    };

    Object.assign(this.options, options);
  }

  public get status(): ITimingEventStatus {
    return {
      running: this.isRunning,
      complete: this.isComplete
    };
  }

  public get value(): boolean {
    const td = this.timeDiff;
    if (td >= this.options.diff) {
      this.startTime = this.time;
      return true;
    }

    return false;
  }
}
