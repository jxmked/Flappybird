import IFlying from '../abstracts/flying';
import { lerp } from '../../../utils';

export class Fly extends IFlying {
  public get value(): ICoordinate {
    if (!this.isRunning) {
      return this.isComplete ? this.options.to : this.options.from;
    }

    const f = this.options.from;
    const t = this.options.to;
    const diff = this.timeDiff / this.options.duration;

    if (diff >= 1) {
      this.stop();

      // Prevent bounce effect
      return this.options.to;
    }

    return {
      x: lerp(f.x, t.x, this.inUseTransition(diff)),
      y: lerp(f.y, t.y, this.inUseTransition(diff))
    };
  }
}
