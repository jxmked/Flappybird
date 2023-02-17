import AbsFading from '../abstracts/fading';
import { swing } from '../easing';

export class FadeOut extends AbsFading {
  public get value(): number {
    if (this.isComplete && !this.isRunning) return 0;

    const value = (this.time - this.startTime) / this.options.duration;

    if (value >= 1) {
      this.isRunning = false;
      this.isComplete = true;
    }

    return swing(1 - value);
  }
}
