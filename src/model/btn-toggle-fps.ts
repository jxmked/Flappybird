import Parent from '../abstracts/button-event-handler';
import SpriteDestructor from '../lib/sprite-destructor';
import Stats from '../lib/stats';
import Sfx from './sfx';

export default class ToggleFPSBtn extends Parent {
  private assets: Map<string, HTMLImageElement>;
  private is_active: boolean;

  constructor() {
    super();
    this.initialWidth = 0.098;
    this.assets = new Map();
    this.is_active = Stats.SHOW_FPS;
    this.coordinate.x = 0.92;
    this.coordinate.y = 0.1;
    this.active = true;
  }

  public click(): void {
    Sfx.swoosh();

    this.is_active = !this.is_active;

    Stats.SHOW_FPS = this.is_active;
  }

  private setImg(): void {
    const key = `${this.is_active ? 'enable' : 'disable'}`;
    this.img = this.assets.get(key)!;
  }

  public init(): void {
    this.assets.set('disable', SpriteDestructor.asset('btn-fps-disable'));
    this.assets.set('enable', SpriteDestructor.asset('btn-fps-enable'));

    this.setImg();
  }

  public Update(): void {
    this.reset();

    if (this.isHovered) {
      this.move({
        x: 0,
        y: 0.004
      });
    }

    this.setImg();

    super.Update();
  }

  public Display(ctx: CanvasRenderingContext2D): void {
    const xLoc = this.calcCoord.x;
    const yLoc = this.calcCoord.y;
    const xRad = this.dimension.width / 2;
    const yRad = this.dimension.height / 2;

    ctx.drawImage(this.img!, xLoc - xRad, yLoc - yRad, xRad * 2, yRad * 2);
  }
}
