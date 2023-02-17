/**
 * Display "Get Ready" & "Instruction"
 * Let the bird swing while waiting...
 * No Pipes
 * Wait for the tap event
 * */
import ParentClass from '../abstracts/parent-class';
import BirdModel from '../model/bird';
import PipeGenerator from '../model/pipe-generator';
import CounterModel from '../model/count';
import { lerp } from '../utils';
import MainGameController from '../game';

export default class GetReady extends ParentClass {
  bird: BirdModel;
  pipeGenerator: PipeGenerator;
  state: string;
  count: CounterModel;
  game: MainGameController;

  constructor(game: MainGameController) {
    super();
    this.state = 'waiting';
    this.bird = new BirdModel();
    this.count = new CounterModel();
    this.game = game;
    this.pipeGenerator = this.game.pipeGenerator;
  }

  init(): void {
    this.bird.init();
    this.count.init();
  }

  resize({ width, height }: IDimension): void {
    super.resize({ width, height });

    this.bird.resize(this.canvasSize);
    this.count.resize(this.canvasSize);
  }

  Update(): void {
    if (!this.bird.alive) {
      this.game.bgPause = true;
      this.bird.Update();
      return;
    }

    if (this.state === 'waiting') {
      this.bird.doWave(
        {
          x: this.bird.coordinate.x,
          y: lerp(0, this.canvasSize.height, 0.48)
        },
        1,
        6
      );
      return;
    }

    this.pipeGenerator.Update();

    this.bird.Update();
    if (this.bird.isDead(this.pipeGenerator.pipes)) {
      /*  Sfx.hit(() => {
        this.bird.playDead();
      }); */
    }
  }

  Display(context: CanvasRenderingContext2D): void {
    if (this.state === 'playing' || this.state === 'waiting') {
      this.count.setNum(this.bird.score);
      this.count.Display(context);
      this.bird.Display(context);
    }
  }

  click({ x, y }: ICoordinate): void {
    this.state = 'playing';
    this.bird.flap();
  }
}
