import BgModel from './model/background';
import PlatformModel from './model/platform';

export default class Game {
  background: BgModel;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  platform: PlatformModel;

  constructor(canvas: HTMLCanvasElement) {
    this.background = new BgModel();
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d')!;
    this.platform = new PlatformModel();
  }

  init(): void {
    this.background.init();
    this.platform.init();
  }

  Resize({ width, height }: IDimension): void {
    this.background.resize({ width, height });
    this.platform.resize({ width, height });
  }

  Update(): void {
    this.background.Update();
    this.platform.Update();
  }

  Display(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.background.Display(this.context);
    this.platform.Display(this.context);
  }
}
