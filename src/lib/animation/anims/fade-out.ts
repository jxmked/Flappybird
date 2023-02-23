import AbsFading from '../abstracts/fading';

export class FadeOut extends AbsFading {
  public get value(): number {
    if (this.isComplete && !this.isRunning) return 0;

    const value = (this.time - this.startTime) / this.options.duration;

    if (value >= 1) {
      this.stop();
    }

    return this.inUseTransition(1 - value);
  }
}
