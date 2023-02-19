import Parent from '../abstracts/button-event-handler';
import Sfx from './sfx';
import { asset } from '../lib/sprite-destructor';

export default class PlayButton extends Parent {
  protected callback: Function;

  constructor() {
    super();
    this.initialWidth = 0.38;
    this.coordinate = {
      x: 0.259,
      y: 0.6998
    };
    this.active = true;
    this.callback = () => {};
  }

  public click(): void {
    Sfx.swoosh();
    this.callback();
  }

  public onClick(callback: Function): void {
    this.callback = callback;
  }

  public init(): void {
    this.img = asset('btn-play');
  }

  public Update(): void {
    this.reset();

    if (this.isHovered) {
      this.move({
        x: 0,
        y: 0.004
      });
    }

    super.Update();
  }

  public Display(context: CanvasRenderingContext2D): void {
    const xLoc = this.calcCoord.x;
    const yLoc = this.calcCoord.y;
    const xRad = this.dimension.width / 2;
    const yRad = this.dimension.height / 2;

    context.drawImage(this.img!, xLoc - xRad, yLoc - yRad, xRad * 2, yRad * 2);
  }
}
