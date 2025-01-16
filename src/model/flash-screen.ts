import ParentClass from '../abstracts/parent-class';
import { FadeOut } from '../lib/animation';
import { IEasingKey } from '../lib/animation/easing';
import { IFadingStatus } from '../lib/animation/abstracts/fading';

export interface IFlashScreenConstructorOption {
  style: string;
  strong: number;
  interval: number;
  easing: IEasingKey;
}

export interface IRecordEvent {
  range: {
    min: number;
    max: number;
  };
  callback: IEmptyFunction;
  isCalled: boolean;
}

export interface IFlashScreenStatus extends IFadingStatus {
  value: number;
}

export default class FlashScreen extends ParentClass {
  private fadeEvent: FadeOut;
  private strong: number;
  private style: string;
  private events: IRecordEvent[];
  private value: number;

  constructor({ style, strong, interval, easing }: IFlashScreenConstructorOption) {
    super();
    this.strong = strong;
    this.style = style;
    this.events = [];
    this.fadeEvent = new FadeOut({
      duration: interval,
      transition: easing
    });
    this.value = 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public init(): void {}

  public reset(): void {
    this.fadeEvent.reset();
    for (const evt of this.events) {
      evt.isCalled = false;
    }
  }

  public start(): void {
    this.fadeEvent.start();
  }

  public setEvent(range: number[], callback: IEmptyFunction): void {
    this.events.push({
      range: {
        min: range[0],
        max: range[1]
      },
      callback,
      isCalled: false
    });
  }

  public get status(): IFlashScreenStatus {
    return { ...this.fadeEvent.status, value: this.value };
  }

  public Update(): void {
    if (!this.status.complete || this.status.running) {
      this.value = this.fadeEvent.value;

      for (const evt of this.events) {
        if (evt.isCalled) continue;

        if (evt.range.min <= this.value && evt.range.max >= this.value) {
          evt.callback();
          evt.isCalled = true;
        }
      }
    } else {
      this.value = 0;
    }
  }

  public Display(context: CanvasRenderingContext2D): void {
    context.globalAlpha = this.strong * this.value;
    context.fillStyle = this.style;
    context.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height);
    context.fill();
    context.globalAlpha = 1;
  }
}
