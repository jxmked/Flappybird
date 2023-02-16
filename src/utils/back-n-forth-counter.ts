/**
 * A function that makes the value go back and forth
 * and get the current stop
 * */
class BackNForthCounter {
  private min: number;
  private max: number;

  /**
   * Array Hit points
   *
   * Must be in range of min and max.
   *
   * */
  private stops: number[];
  private state: number; // 1 = sum, 0 = subtract
  private currentValue: number;
  private speedValue: number;

  private currentStop: number;

  constructor(min: number, max: number, stops: number[]) {
    this.min = min;
    this.max = max;
    this.stops = stops;
    this.state = 1;
    this.currentValue = 0;
    this.speedValue = 0;
    this.currentStop = 0;
  }

  speed(value: number): void {
    this.speedValue = Math.abs(value);
  }

  Update(): void {
    if (this.currentValue >= this.max) {
      this.state = 0;
    } else if (this.currentValue <= this.min) {
      this.state = 1;
    }

    for (let i = this.stops.length - 1; i >= 0; i--) {
      if (this.currentValue >= this.stops[i]) {
        this.currentStop = i;
        break;
      }
    }

    this.currentValue += this.state === 0 ? -this.speedValue : this.speedValue;
  }

  getValue(): number {
    return this.currentValue;
  }

  getStop(): number {
    return this.currentStop;
  }
}

export { BackNForthCounter };
