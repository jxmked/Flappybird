import BgModel from './model/background';
import PlatformModel from './model/platform';
import PipeModel from './model/pipe';
import SFX from './model/sfx';
import { lerp } from './utils';

export default class Game {
  background: BgModel;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  platform: PlatformModel;
  pipes: PipeModel[];
  lastPipeXDist: number;
  PipeDist: number;

  temp: ICoordinate;

  constructor(canvas: HTMLCanvasElement) {
    this.background = new BgModel();
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d')!;
    this.platform = new PlatformModel();
    this.pipes = [];

    // Pipe and Platform X Velocity
    this.platform.velocity.x = 0.0027;

    // Last Pipe DIstance
    this.lastPipeXDist = 0;

    // Pipe Distance
    this.PipeDist = 0.1;

    this.temp = { x: 0, y: 0 };
  }

  init(): void {
    this.background.init();
    this.platform.init();
    new SFX().init();
  }

  addPipe(hollPosition: number): void {
    const pipe = new PipeModel();

    pipe.resize({
      width: this.canvas.width,
      height: this.canvas.height
    });

    pipe.velocity.x = this.platform.velocity.x;

    pipe.setHollPosition(hollPosition, 0.2);

    pipe.init();
    this.pipes.push(pipe);
  }

  Resize({ width, height }: IDimension): void {
    this.background.resize({ width, height });
    this.platform.resize({ width, height });

    for (const pipe of this.pipes) {
      pipe.resize({ width, height });
    }
  }

  PipeGenerator(): void {
    this.lastPipeXDist++;

    if ((this.lastPipeXDist / this.canvas.width) * 100 >= lerp(0, this.canvas.width, this.PipeDist)) {
      const height = lerp(0, this.canvas.height, 0.1);
      const platformHeight = lerp(0, this.canvas.height - this.platform.platformSize.height, 0.75);
      const rdm = Math.floor(Math.random() * (this.canvas.height - height - platformHeight)) + height;

      this.addPipe(rdm);
      this.lastPipeXDist = 0;
    }
  }

  Update(): void {
    this.background.Update();
    this.platform.Update();

    this.PipeGenerator();

    for (let index = 0; index < this.pipes.length; index++) {
      this.pipes[index].Update();

      if (this.pipes[index].isOut()) {
        this.pipes.splice(index, 1);
      }
    }
  }

  Display(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.background.Display(this.context);

    for (const pipe of this.pipes) {
      pipe.Display(this.context);
    }

    this.platform.Display(this.context);
    
    this.context.beginPath();
    this.context.arc(this.temp.x, this.temp.y, 10, 0, Math.PI * 2);
    this.context.fillStyle = 'red';
    this.context.fill();
    this.context.closePath();
  }

  onClick({ x, y }: ICoordinate): void {
    this.temp = { x, y };
    SFX.wing();
  }
}
