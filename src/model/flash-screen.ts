import ParentClass from '../abstracts/parent-class';
import { FadeOut } from '../lib/animation';
import { lerp } from '../utils';

export interface IFlashScreenConstructorOption {
  style: string;
  strong: number;
  interval: number;
}

export interface IRecordEvent {
  range: {
    min: number;
    max: number;
  };
  callback: Function;
}

export default class FlashScreen extends ParentClass {
  private fadeEvent: FadeOut;
  private strong: number;
  private style: string;
  private events: IRecordEvent[];

  constructor({ style, strong, interval }: IFlashScreenConstructorOption) {
    super();
    this.strong = strong;
    this.style = style;
    this.events = [];
    this.fadeEvent = new FadeOut({
      duration: interval,
      transition: 'sineWaveHS'
    });
  }

  public init(): void {}

  public reset(): void {
    this.fadeEvent.reset();
  }

  public resize({ width, height }: IDimension): void {
    super.resize({ width, height });
  }

  public start(): void {
    this.fadeEvent.start();
  }

  public setEvent(range: number[], callback: Function): void {
    this.events.push({
      range: {
        min: range[0],
        max: range[1]
      },
      callback
    });
  }

  public Update(): void {}

  public Display(context: CanvasRenderingContext2D): void {
    let value = this.fadeEvent.value;

    if (this.fadeEvent.status.complete || !this.fadeEvent.status.running) {
      value = 0;
    } else {
      for (const evt of this.events) {
        if (evt.range.min <= value && evt.range.max >= value) {
          evt.callback();
        }
      }
    }

    context.globalAlpha = lerp(0, this.strong, value);
    context.fillStyle = this.style;
    context.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height);
    context.fill();

    context.globalAlpha = 1;
  }
}
