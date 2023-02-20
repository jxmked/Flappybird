export default abstract class DefaultProperties {
  protected isRunning: boolean;
  protected isComplete: boolean;
  protected startTime: number;

  constructor() {
    this.isComplete = false;
    this.isRunning = false;
    this.startTime = 0;
  }

  protected get time(): number {
    return performance.now();
  }

  protected get timeDiff(): number {
    if (!this.isRunning) return 0;
    return this.time - this.startTime;
  }

  public stop(): void {
    this.isComplete = true;
    this.isRunning = false;
  }

  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isComplete = false;
    this.startTime = this.time;
  }

  public reset(): void {
    this.isComplete = false;
    this.isRunning = false;
  }
}
