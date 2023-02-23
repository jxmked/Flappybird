import AbsFading from '../abstracts/fading';
import { flipRange } from '../../../utils';

export class FadeOut extends AbsFading {
  public get value(): number {
    if (this.isComplete || !this.isRunning) return 0;

    const value = this.timeDiff / this.options.duration;

    if (value >= 1) {
      this.stop();
      return 0;
    }

    return this.inUseTransition(flipRange(0, 1, value));
  }
}
