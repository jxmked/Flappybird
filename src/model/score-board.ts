import { lerp, rescaleDim } from '../utils';

import ParentObject from '../abstracts/parent-class';
import PlayButton from './btn-play';
import RankingButton from './btn-ranking';
import { asset } from '../lib/sprite-destructor';

export default class ScoreBoard extends ParentObject {
  private images: Map<string, HTMLImageElement>;
  public playButton: PlayButton;
  public rankingButton: RankingButton;

  constructor() {
    super();
    this.images = new Map<string, HTMLImageElement>();
    this.playButton = new PlayButton();
    this.rankingButton = new RankingButton();
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

    const sbScaled = rescaleDim(
      {
        width: this.images.get('score-board')!.width,
        height: this.images.get('score-board')!.height
      },
      { width: lerp(0, this.canvasSize.width, 0.85) }
    );

    context.drawImage(
      this.images.get('score-board')!,
      lerp(0, this.canvasSize.width, 0.5) - sbScaled.width / 2,
      lerp(0, this.canvasSize.height, 0.438) - sbScaled.height / 2,
      sbScaled.width,
      sbScaled.height
    );

    this.rankingButton.Display(context);
    this.playButton.Display(context);
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
