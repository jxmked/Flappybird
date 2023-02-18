import ParentObject from "../abstracts/parent-class";
import { asset } from "../lib/sprite-destructor";
import { lerp, rescaleDim } from "../utils";
import PlayButton from "./btn-play";
import RankingButton from "./btn-ranking";

export default class ScoreBoard extends ParentObject {
  images: Map<string, HTMLImageElement>;
  playButton:PlayButton;
  rankingButton:RankingButton;

  constructor() {
    super()
    this.images = new Map<string, HTMLImageElement>();
    this.playButton = new PlayButton();
    this.rankingButton = new RankingButton();
  }
  init(): void {
    this.images.set('banner-gameover', asset('banner-game-over'))
    this.images.set("score-board", asset("score-board"));
    this.images.set("coin-10", asset('coin-dull-bronze'));
    this.images.set('coin-20', asset('coin-dull-metal'));
    this.images.set('coin-30', asset('coin-shine-gold'));
    this.images.set('coin-40', asset('coin-shine-silver'));
    this.images.set('new-icon', asset('toast-new'));
    this.images.set('spark-sm', asset('spark-sm'));
    this.images.set('park-md', asset('spark-md'))
    this.images.set('spark-lg', asset('spark-lg'));

    for(let i = 0; i < 10; ++i) {
      this.images.set(`number-${i}`, asset(`number-md-${i}`));
    }

    this.rankingButton.init();
    this.playButton.init();
  }

  resize({ width, height }: IDimension): void {
    super.resize({width, height});

    this.rankingButton.resize(this.canvasSize)
    this.playButton.resize(this.canvasSize)
  }

  Update(): void {
    this.rankingButton.Update();
    this.playButton.Update();
    // throw new Error("Method not implemented.");
  }

  Display(context: CanvasRenderingContext2D): void {
    
    const bgoScaled = rescaleDim({
      width: this.images.get('banner-gameover')!.width,
      height: this.images.get('banner-gameover')!.height
    }, { width: lerp(0, this.canvasSize.width, 0.7)})

    context.drawImage(
      this.images.get('banner-gameover')!,
      lerp(0, this.canvasSize.width, 0.5) - (bgoScaled.width / 2),
      lerp(0, this.canvasSize.height, 0.3) - (bgoScaled.height / 2),
      bgoScaled.width,
      bgoScaled.height
    )

    this.rankingButton.Display(context)
    this.playButton.Display(context)
    
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
