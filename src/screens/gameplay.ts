/**
 * Display "Get Ready" & "Instruction"
 * Let the bird swing while waiting...
 * No Pipes
 * Wait for the tap event
 * */

import { flipRange, lerp } from '../utils';

import BannerInstruction from '../model/banner-instruction';
import BirdModel from '../model/bird';
import CounterModel from '../model/count';
import { FadeOutIn } from '../lib/animation';
import { IScreenChangerObject } from '../lib/screen-changer';
import MainGameController from '../game';
import ParentClass from '../abstracts/parent-class';
import PipeGenerator from '../model/pipe-generator';
import ScoreBoard from '../model/score-board';
import Sfx from '../model/sfx';

export default class GetReady extends ParentClass implements IScreenChangerObject {
  private bird: BirdModel;
  private pipeGenerator: PipeGenerator;
  private state: string;
  private gameState: string;
  private count: CounterModel;
  private game: MainGameController;
  private bannerInstruction: BannerInstruction;
  private scoreBoard: ScoreBoard;
  private transition: FadeOutIn;
  private hideBird: boolean;

  private showScoreBoard: boolean;

  constructor(game: MainGameController) {
    super();
    this.state = 'waiting';
    this.bird = new BirdModel();
    this.count = new CounterModel();
    this.game = game;
    this.pipeGenerator = this.game.pipeGenerator;
    this.bannerInstruction = new BannerInstruction();
    this.gameState = 'none';
    this.scoreBoard = new ScoreBoard();
    this.transition = new FadeOutIn({ duration: 500 });

    this.hideBird = false;
    this.showScoreBoard = false;
  }

  public init(): void {
    this.bird.init();
    this.count.init();
    this.bannerInstruction.init();
    this.scoreBoard.init();
    this.setButtonEvent();
  }

  public reset(): void {
    this.gameState = 'none';
    this.state = 'waiting';
    this.resize(this.canvasSize);
    this.game.background.reset();
    this.game.platform.reset();
    this.pipeGenerator.reset();
    this.bannerInstruction.reset();
    this.game.bgPause = false;
    this.hideBird = false;
    this.showScoreBoard = false;
    this.scoreBoard.hide();
    this.bird.reset();
  }

  public resize({ width, height }: IDimension): void {
    super.resize({ width, height });

    this.bird.resize(this.canvasSize);
    this.count.resize(this.canvasSize);
    this.bannerInstruction.resize(this.canvasSize);
    this.scoreBoard.resize(this.canvasSize);
  }

  public Update(): void {
    if (this.bird.alive) {
      this.scoreBoard.Update();
    }

    if (!this.bird.alive) {
      this.scoreBoard.Update();
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

    this.bannerInstruction.Update();
    this.pipeGenerator.Update();
    this.bird.Update();

    if (this.bird.isDead(this.pipeGenerator.pipes)) {
      this.gameState = 'died';
      window.setTimeout(() => {
        this.scoreBoard.setScore(this.bird.score);
        this.showScoreBoard = true;
        window.setTimeout(() => {
          this.scoreBoard.showBoard();
          Sfx.swoosh();
        }, 700);
        this.scoreBoard.showBanner();
        Sfx.swoosh();
      }, 500);

      Sfx.hit(() => {
        this.bird.playDead();
      });
    }
  }

  public Display(context: CanvasRenderingContext2D): void {
    if (this.state === 'playing' || this.state === 'waiting') {
      this.bannerInstruction.Display(context);

      if (this.gameState !== 'died' || !this.showScoreBoard) {
        this.count.setNum(this.bird.score);
        this.count.Display(context);
      }

      if (!this.hideBird) this.bird.Display(context);

      this.scoreBoard.Display(context);
    }

    context.globalAlpha = flipRange(0, 1, this.transition.value);

    // check if the opacity reaches close to 1
    if (context.globalAlpha >= 0.99) {
      this.reset();
    }

    context.fillStyle = 'black';
    context.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height);
    context.fill();

    context.globalAlpha = 1;
  }

  private setButtonEvent(): void {
    this.scoreBoard.onRestart(() => {
      if (this.transition.status.running) return;
      this.transition.start();
    });

    // this.scoreBoard.onShowRanks(() => {
    //   console.log("ranking button")
    // })
  }

  public click({ x, y }: ICoordinate): void {
    if (this.gameState === 'died') return;

    this.state = 'playing';
    this.gameState = 'playing';
    this.bannerInstruction.tap();
    this.bird.flap();
  }

  public mouseDown({ x, y }: ICoordinate): void {
    if (this.gameState !== 'died') return;

    this.scoreBoard.mouseDown({ x, y });
  }

  public mouseUp({ x, y }: ICoordinate): void {
    if (this.gameState !== 'died') return;

    this.scoreBoard.mouseUp({ x, y });
  }
}