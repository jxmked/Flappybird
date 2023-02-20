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
  private currentScore: number;
  private currentGeneratedNumber: number;
  private currentHighScore: number;
  constructor() {
    super();
    this.images = new Map<string, HTMLImageElement>();
    this.playButton = new PlayButton();
    this.rankingButton = new RankingButton();
    this.currentHighScore = 0;
    this.currentGeneratedNumber = 0;
    this.currentScore = 0;
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

      // Need to clone
      const anim = Object.assign({}, this.FlyInAnim.value);
      anim.x = lerp(0, this.canvasSize.width, anim.x) - sbScaled.width / 2;
      anim.y = lerp(0, this.canvasSize.height, anim.y) - sbScaled.height / 2;

      context.drawImage(
        this.images.get('score-board')!,
        anim.x,
        anim.y,
        sbScaled.width,
        sbScaled.height
      );

      this.displayBestScore(context, anim, sbScaled, false);
      this.currentScore = 20;
      this.addMedal(context, anim, sbScaled);
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

  private setHighScore(num: number): void {
    this.currentHighScore = num;
  }

  public setScore(num: number): void {
    this.currentScore = num;
  }

  private addMedal(
    context: CanvasRenderingContext2D,
    coord: ICoordinate,
    parentSize: IDimension
  ): void {
    if (this.currentScore < 10) return; // So sad having a no medal :)

    let medal: HTMLImageElement = this.images.get('coin-40')!;
    if (this.currentScore >= 30 && this.currentScore < 40) {
      medal = this.images.get('coin-30')!;
    } else if (this.currentScore >= 20 && this.currentScore < 30) {
      medal = this.images.get('coin-20')!;
    } else if (this.currentScore >= 10 && this.currentScore < 20) {
      medal = this.images.get('coin-10')!;
    }

    coord.x = lerp(0, coord.x, 0.36);
    coord.y = lerp(0, coord.y, 0.9196);

    const scaled = rescaleDim(
      {
        width: medal.width,
        height: medal.height
      },
      { width: lerp(0, parentSize.width, 0.1878) }
    );

    context.drawImage(medal, coord.x, coord.y, scaled.width, scaled.height);
  }

  private displayBestScore(
    context: CanvasRenderingContext2D,
    coord: ICoordinate,
    parentSize: IDimension,
    haveNewToast: boolean
  ): void {
    const numSize = rescaleDim(
      {
        width: this.images.get('number-1')!.width,
        height: this.images.get('number-1')!.height
      },
      { width: lerp(0, parentSize.width, 0.052) }
    );
    coord.x += parentSize.width / 2;
    coord.y += parentSize.height / 2;

    const numPos: ICoordinate = { x: 0, y: 0 };
    numPos.x = lerp(0, coord.x, 1.565);
    numPos.y = lerp(0, coord.y, 1.078);

    const numArr: string[] = String(this.currentHighScore).split('');

    context.save();
    context.translate(numPos.x, numPos.y);

    numArr.reverse().forEach((c: string, index: number) => {
      context.drawImage(
        this.images.get(`number-${c}`)!,
        -(index * (numSize.width + 5)),
        0,
        numSize.width,
        numSize.height
      );
    });

    if (!haveNewToast) {
      context.restore();
      return;
    }

    numPos.x = lerp(0, numPos.x, -0.26);
    numPos.y = lerp(0, numPos.y, -0.0768);

    context.translate(numPos.x, numPos.y);

    const toastSize = rescaleDim(
      {
        width: this.images.get('new-icon')!.width,
        height: this.images.get('new-icon')!.height
      },
      { width: lerp(0, parentSize.width, 0.14) }
    );

    context.drawImage(
      this.images.get('new-icon')!,
      0,
      0,
      toastSize.width,
      toastSize.height
    );

    context.restore();
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
