import Fading from '../abstracts/fading';

export class FadeOutIn extends Fading {
  public get value(): number {
    if (this.isComplete && !this.isRunning) return 1;

    const stime = this.startTime;
    const value = (this.time - stime) / this.options.duration;

    if (value >= 2) this.stop();

    return this.inUseTransition(1 - value);
  }
}
