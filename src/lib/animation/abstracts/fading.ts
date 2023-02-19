export interface IFadingOptions {
  duration: number;
}

export interface IConstructorFadingOptions extends Partial<IFadingOptions> {}

export interface IFadingStatus {
  running: boolean;
  complete: boolean;
}

export default abstract class Fading {
  protected startTime: number;
  protected isRunning: boolean;
  protected isComplete: boolean;
  protected options: IFadingOptions;

  constructor(options?: IConstructorFadingOptions) {
    this.startTime = 0;
    this.isRunning = false;
    this.isComplete = true;
    this.options = {
      duration: 500 // ms
    };

    Object.assign(this.options, options ?? {});
  }

  protected get time(): number {
    return performance.now();
  }

  public reset(): void {
    this.isComplete = true;
    this.isRunning = false;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startTime = this.time;
    this.isComplete = false;
  }

  public stop(): void {
    this.isRunning = false;
    this.isComplete = true;
  }

  public get status(): IFadingStatus {
    return {
      running: this.isRunning,
      complete: this.isComplete
    };
  }

  public abstract get value(): number;
}
