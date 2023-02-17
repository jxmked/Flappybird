import Parent from '../abstracts/button-event-handler';
import { asset } from '../lib/sprite-destructor';

export default class PlayButton extends Parent {
  constructor() {
    super();
    this.initialWidth = 0.36;
    this.coordinate = {
      x: 0.3,
      y: 0.708
    };
    this.active = true;
  }

  init(): void {
    this.img = asset('btn-play');
  }

  Update(): void {
    if (this.isHover) {
      this.move({
        x: 0,
        y: 0.007
      });
    } else {
      this.move({
        x: 0,
        y: 0
      });
    }

    super.Update();
  }

  click(): void {
    console.log('click');
  }

  Display(context: CanvasRenderingContext2D): void {
    const xLoc = this.calcCoord.x;
    const yLoc = this.calcCoord.y;
    const xRad = this.dimension.width / 2;
    const yRad = this.dimension.height / 2;

    context.drawImage(this.img!, xLoc - xRad, yLoc - yRad, xRad * 2, yRad * 2);
  }
}
