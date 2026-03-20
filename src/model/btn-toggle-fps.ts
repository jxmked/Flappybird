import SpriteDestructor from '../lib/sprite-destructor';
import Stats from '../lib/stats';
import PlayButton from './btn-play';
import Sfx from './sfx';

export default class ToggleFPSBtn extends PlayButton {
  protected assets: Map<string, HTMLImageElement>;

  constructor() {
    super();
    this.initialWidth = 0.098;
    this.assets = new Map();
    this.coordinate.x = 0.92;
    this.coordinate.y = 0.1;
  }

  public click(): void {
    Sfx.swoosh();

    Stats.SHOW_FPS = !Stats.SHOW_FPS;

    this.setImg();
  }

  protected setImg(): void {
    const key = `${Stats.SHOW_FPS ? 'enable' : 'disable'}`;
    this.img = this.assets.get(key)!;
  }

  public init(): void {
    this.assets.set('disable', SpriteDestructor.asset('btn-fps-disable'));
    this.assets.set('enable', SpriteDestructor.asset('btn-fps-enable'));

    this.setImg();
  }
}
