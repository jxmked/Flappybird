import BgModel from './model/background';
import PlatformModel from './model/platform';
import PipeModel from './model/pipe';
import BirdModel from './model/bird';
import CountModel from './model/count';
import Sfx from './model/sfx';
import PipeGenerator, { IPipeGeneratorValue } from './model/pipe-generator';
import { SFX_VOLUME } from './constants';

export default class Game {
  background: BgModel;
  platform: PlatformModel;
  bird: BirdModel;
  pipeGenerator: PipeGenerator;

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  count: CountModel;

  constructor(canvas: HTMLCanvasElement) {
    this.background = new BgModel();
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d')!;
    this.platform = new PlatformModel();

    this.pipeGenerator = new PipeGenerator();
    this.bird = new BirdModel();
    this.count = new CountModel();
  }

  init(): void {
    this.bird.init();
    this.background.init();
    this.platform.init();
    this.count.init();
    Sfx.init();
    Sfx.volume(SFX_VOLUME);
  }

  addPipe({ position }: IPipeGeneratorValue): void {
    const pipe = new PipeModel();

    pipe.resize({
      width: this.canvas.width,
      height: this.canvas.height
    });

    pipe.setHollPosition(position);

    pipe.init();
    this.pipeGenerator.pipes.push(pipe);
  }

  Resize({ width, height }: IDimension): void {
    this.background.resize({ width, height });
    this.platform.resize({ width, height });
    this.count.resize({ width, height });

    // Set Platform size first
    BirdModel.platformHeight = this.platform.platformSize.height;
    this.bird.resize({ width, height });

    this.pipeGenerator.resize({
      max: height - this.platform.platformSize.height,
      width: width,
      height: height
    });

    for (const pipe of this.pipeGenerator.pipes) {
      pipe.resize({ width, height });
    }

    this.canvas.width = width;
    this.canvas.height = height;
  }

  Update(): void {
    if (!this.bird.alive) {
      this.bird.Update();
      return;
    }
    this.background.Update();
    this.platform.Update();

    /**
     * Pipe regeneration
     */
    if (this.pipeGenerator.needPipe()) {
      const pipeAttr = this.pipeGenerator.generate();
      this.addPipe(pipeAttr);
    }

    for (let index = 0; index < this.pipeGenerator.pipes.length; index++) {
      this.pipeGenerator.pipes[index].Update();

      if (this.pipeGenerator.pipes[index].isOut()) {
        this.pipeGenerator.pipes.splice(index, 1);
      }
    }

    this.bird.Update();
    if (this.bird.isDead(this.pipeGenerator.pipes)) {
      Sfx.hit();
      this.bird.playDead();
    }
  }

  Display(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.background.Display(this.context);

    for (const pipe of this.pipeGenerator.pipes) {
      pipe.Display(this.context);
    }

    this.platform.Display(this.context);

    this.bird.Display(this.context);

    this.count.setNum(this.bird.score);
    this.count.Display(this.context);
  }

  onClick({ x, y }: ICoordinate): void {
    this.bird.flap();
  }
}
