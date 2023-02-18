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
import Sfx from '../model/sfx';
import { IScreenChangerObject } from '../lib/screen-changer';
import BannerInstruction from '../model/banner-instruction';
import ScoreBoard from '../model/score-board';

export default class GetReady extends ParentClass implements IScreenChangerObject {
  bird: BirdModel;
  pipeGenerator: PipeGenerator;
  state: string;
  gameState:string;
  count: CounterModel;
  game: MainGameController;
  bannerInstruction: BannerInstruction;
  scoreBoard:ScoreBoard;

  constructor(game: MainGameController) {
    super();
    this.state = 'waiting';
    this.bird = new BirdModel();
    this.count = new CounterModel();
    this.game = game;
    this.pipeGenerator = this.game.pipeGenerator;
    this.bannerInstruction = new BannerInstruction();
    this.gameState = "none"
    this.scoreBoard = new ScoreBoard();
  }

  init(): void {
    this.bird.init();
    this.count.init();
    this.bannerInstruction.init();
    this.scoreBoard.init();
    this.setButtonEvent();
  }

  resize({ width, height }: IDimension): void {
    super.resize({ width, height });

    this.bird.resize(this.canvasSize);
    this.count.resize(this.canvasSize);
    this.bannerInstruction.resize(this.canvasSize)
    this.scoreBoard.resize(this.canvasSize)
  }

  Update(): void {
    this.scoreBoard.playButton.active = true
    this.scoreBoard.rankingButton.active = true
    this.scoreBoard.Update();
    
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

    this.bannerInstruction.Update();
    this.pipeGenerator.Update();
    this.bird.Update();

    if (this.bird.isDead(this.pipeGenerator.pipes)) {
      this.gameState = "died"
      Sfx.hit(() => {
        this.bird.playDead();
      });
    }
  }

  Display(context: CanvasRenderingContext2D): void {
    if (this.state === 'playing' || this.state === 'waiting') {
      this.bannerInstruction.Display(context);
      this.count.setNum(this.bird.score);
      this.count.Display(context);
      this.bird.Display(context);

      if(this.gameState === 'died') {
        this.scoreBoard.Display(context)
      }
    }

  }

  setButtonEvent(): void {
    this.scoreBoard.playButton.onClick(() => {
      console.log("Play button")
    })
    this.scoreBoard.rankingButton.onClick(() => {
      console.log("ranking button")
    })
  }

  click({ x, y }: ICoordinate): void {
    if(this.gameState === 'died') return;

    this.state = 'playing';
    this.gameState = "playing"
    this.bannerInstruction.tap();
    this.bird.flap();
  }

  public mouseDown({ x, y }: ICoordinate): void {
    if(this.gameState !== 'died') return;
    
    this.scoreBoard.mouseDown({x, y})
  }

  public mouseUp({ x, y }: ICoordinate): void {
    if(this.gameState !== 'died') return;
    
    this.scoreBoard.mouseUp({x, y})
  }
}
