import DefaultProps from './default-properties';

export interface IFadingOptions {
  duration: number;
}

export interface IConstructorFadingOptions extends Partial<IFadingOptions> {}

export interface IFadingStatus {
  running: boolean;
  complete: boolean;
}

export default abstract class Fading extends DefaultProps {
  protected options: IFadingOptions;

  constructor(options?: IConstructorFadingOptions) {
    super();
    this.options = {
      duration: 500 // ms
    };

    Object.assign(this.options, options ?? {});
  }

  public get status(): IFadingStatus {
    return {
      running: this.isRunning,
      complete: this.isComplete
    };
  }

  public abstract get value(): number;
}
