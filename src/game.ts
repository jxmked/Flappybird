import BgModel from './model/background';
import PlatformModel from './model/platform';
import PipeModel from './model/pipe';

export default class Game {
  background: BgModel;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  platform: PlatformModel;
  pipes: PipeModel[];

  constructor(canvas: HTMLCanvasElement) {
    this.background = new BgModel();
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d')!;
    this.platform = new PlatformModel();
    this.pipes = [];
  }

  init(): void {
    this.background.init();
    this.platform.init();
  }

  addPipe(hollPosition: number): void {
    const x = new PipeModel();
    x.coordinate.x = 100;
    x.setHollPosition(10);

    this.pipes.push(x);
  }

  Resize({ width, height }: IDimension): void {
    this.background.resize({ width, height });
    this.platform.resize({ width, height });

    for (const pipe of this.pipes) {
      console.log(pipe.canvasSize)
      pipe.resize({ width, height });
    }

    this.addPipe(8);
  }

  Update(): void {
    this.background.Update();
    this.platform.Update();

    for (const pipe of this.pipes) {
      pipe.Update();
    }
  }

  Display(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.background.Display(this.context);
    this.platform.Display(this.context);

    for (const pipe of this.pipes) {
      pipe.Display(this.context);
    }
  }
}
