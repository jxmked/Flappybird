import PlayButton from './btn-play'; // Instead of duplicating
import { asset } from '../lib/sprite-destructor';
import Sfx from './sfx';

export default class ToggleSpeakerBtn extends PlayButton {
  private assets: Map<string, HTMLImageElement>;
  private is_mute: boolean;
  private color: string;

  constructor() {
    super();
    this.initialWidth = 0.1;
    this.assets = new Map();
    this.is_mute = false;
    this.color = 'gray';
    this.coordinate.x = 0.93;
    this.coordinate.y = 0.04;
  }

  public click(): void {
    Sfx.swoosh();
    this.callback();
    this.is_mute = !this.is_mute;

    Sfx.currentVolume = this.is_mute ? 0 : 1;
  }

  public onClick(callback: Function): void {
    this.callback = callback;
  }

  private setImg(): void {
    const key = `${this.is_mute ? 'mute' : 'speaker'}-${this.color}`;
    this.img = this.assets.get(key) as HTMLImageElement;
  }

  public init(): void {
    this.assets.set('mute-gray', asset('btn-mute-gray'));
    this.assets.set('mute-green', asset('btn-mute-green'));
    this.assets.set('speaker-gray', asset('btn-speaker-gray'));
    this.assets.set('speaker-green', asset('btn-speaker-green'));

    this.setImg();
  }

  public Update(): void {
    this.reset();

    if (this.isHovered) {
      this.move({
        x: 0,
        y: 0.1
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
