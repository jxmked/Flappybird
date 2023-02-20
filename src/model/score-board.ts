import { lerp, rescaleDim } from '../utils';

import ParentObject from '../abstracts/parent-class';
import PlayButton from './btn-play';
import RankingButton from './btn-ranking';
import { asset } from '../lib/sprite-destructor';
import { Fly } from '../lib/animation';

export interface IImageState {
  banner: boolean;
  scoreBoard: boolean;
  buttons: boolean;
}

export default class ScoreBoard extends ParentObject {
  private images: Map<string, HTMLImageElement>;
  private playButton: PlayButton;
  private rankingButton: RankingButton;
  private show: IImageState;
  private FlyInAnim: Fly;
  constructor() {
    super();
    this.images = new Map<string, HTMLImageElement>();
    this.playButton = new PlayButton();
    this.rankingButton = new RankingButton();
    this.show = {
      banner: false,
      scoreBoard: false,
      buttons: false
    };
    this.FlyInAnim = new Fly({
      duration: 500,
      from: {
        x: 0.5,
        y: 1.5
      },
      to: {
        x: 0.5,
        y: 0.438
      },
      transition: 'easeOutExpo'
    });
  }

  public init(): void {
    this.images.set('banner-gameover', asset('banner-game-over'));
    this.images.set('score-board', asset('score-board'));
    this.images.set('coin-10', asset('coin-dull-bronze'));
    this.images.set('coin-20', asset('coin-dull-metal'));
    this.images.set('coin-30', asset('coin-shine-gold'));
    this.images.set('coin-40', asset('coin-shine-silver'));
    this.images.set('new-icon', asset('toast-new'));
    this.images.set('spark-sm', asset('spark-sm'));
    this.images.set('park-md', asset('spark-md'));
    this.images.set('spark-lg', asset('spark-lg'));

    for (let i = 0; i < 10; ++i) {
      this.images.set(`number-${i}`, asset(`number-md-${i}`));
    }

    this.rankingButton.init();
    this.playButton.init();

    this.playButton.active = false;
    this.rankingButton.active = false;
  }

  public resize({ width, height }: IDimension): void {
    super.resize({ width, height });

    this.rankingButton.resize(this.canvasSize);
    this.playButton.resize(this.canvasSize);
  }

  public Update(): void {
    this.rankingButton.Update();
    this.playButton.Update();
  }

  public Display(context: CanvasRenderingContext2D): void {
    if (this.show.banner) {
      const bgoScaled = rescaleDim(
        {
          width: this.images.get('banner-gameover')!.width,
          height: this.images.get('banner-gameover')!.height
        },
        { width: lerp(0, this.canvasSize.width, 0.7) }
      );

      context.drawImage(
        this.images.get('banner-gameover')!,
        lerp(0, this.canvasSize.width, 0.5) - bgoScaled.width / 2,
        lerp(0, this.canvasSize.height, 0.225) - bgoScaled.height / 2,
        bgoScaled.width,
        bgoScaled.height
      );
    }

    if (this.show.scoreBoard) {
      const sbScaled = rescaleDim(
        {
          width: this.images.get('score-board')!.width,
          height: this.images.get('score-board')!.height
        },
        { width: lerp(0, this.canvasSize.width, 0.85) }
      );

      const anim = this.FlyInAnim.value;

      context.drawImage(
        this.images.get('score-board')!,
        lerp(0, this.canvasSize.width, anim.x) - sbScaled.width / 2,
        lerp(0, this.canvasSize.height, anim.y) - sbScaled.height / 2,
        sbScaled.width,
        sbScaled.height
      );

      if (this.FlyInAnim.status.complete && !this.FlyInAnim.status.running) {
        this.showButtons();
      }
    }

    if (this.show.buttons) {
      this.rankingButton.Display(context);
      this.playButton.Display(context);
    }
  }

  public showBanner(): void {
    this.show.banner = true;
  }

  public showBoard(): void {
    this.show.scoreBoard = true;
    this.FlyInAnim.start();
  }

  public showButtons(): void {
    this.show.buttons = true;
    this.playButton.active = true;
    this.rankingButton.active = true;
  }

  /**
   * Hide all at once
   * */
  public hide(): void {
    this.show.banner = false;
    this.show.scoreBoard = false;
    this.show.buttons = false;
    this.playButton.active = false;
    this.rankingButton.active = false;
    this.FlyInAnim.reset();
  }

  public onRestart(cb: Function): void {
    this.playButton.onClick(cb);
  }

  public onShowRanks(cb: Function): void {
    /**
     * I don't know what to do on ranking?
     *
     * Should i create API for this?
     * */
  }

  public mouseDown({ x, y }: ICoordinate): void {
    this.playButton.mouseEvent('down', { x, y });
    this.rankingButton.mouseEvent('down', { x, y });
  }

  public mouseUp({ x, y }: ICoordinate): void {
    this.playButton.mouseEvent('up', { x, y });
    this.rankingButton.mouseEvent('up', { x, y });
  }
}
