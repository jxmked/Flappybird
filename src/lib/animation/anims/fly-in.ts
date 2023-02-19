import IFlying from '../abstracts/flying';
import { lerp } from '../../../utils';

export class Fly extends IFlying {
  public get value(): ICoordinate {
    if (!this.isRunning && this.isComplete) {
      return this.options.from;
    }

    const f = this.options.from;
    const t = this.options.to;
    const diff = this.timeDiff / this.options.duration;

    if (diff >= 1) {
      this.stop();
    }

    return {
      x: lerp(f.x, t.x, diff),
      y: lerp(f.y, t.y, diff)
    };
  }
}
