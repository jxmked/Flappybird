/**
 * From given coordinate, it will bounce up once while fading in
 * Fade-in duration will be 0.5 sec
 * Bounce duration will be 1 sec
 *
 * */
import DefaultProps from '../abstracts/default-properties';
import * as easing from '../easing';

export interface IBounceIn {
  durations: {
    fading: number;
    bounce: number;
  };
}

export interface IBounceInConstructor extends Partial<IBounceIn> {}

export interface IBounceInStatus {
  running: boolean;
  complete: boolean;
}

export interface IBounceInValue {
  opacity: number;
  value: number;
}

export class BounceIn extends DefaultProps {
  private options: IBounceIn;

  constructor(options?: IBounceInConstructor) {
    super();

    this.options = {
      durations: {
        fading: 400,
        bounce: 1000
      }
    };

    Object.assign(this.options, options);
  }

  public get status(): IBounceInStatus {
    return {
      running: this.isRunning,
      complete: this.isComplete
    };
  }

  get value(): IBounceInValue {
    if (!this.isRunning) {
      return {
        opacity: this.isComplete ? 1 : 0,
        value: 0
      };
    }

    const { fading, bounce } = this.options.durations;
    const timeDiff = this.timeDiff;

    let opacity: number = easing.swing(timeDiff / fading);
    let value: number = -easing.sineWaveHS(timeDiff / bounce);

    if (timeDiff >= Math.max(fading, bounce)) {
      this.stop();
      return {
        opacity: 1,
        value: 0
      };
    }

    if (timeDiff >= fading) {
      opacity = 1;
    }

    if (timeDiff >= bounce) {
      value = 0;
    }

    return { opacity, value };
  }
}
