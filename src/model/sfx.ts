import WebSfx from '../lib/web-sfx';
import sfDie from '../assets/audio/die.ogg';
import sfHit from '../assets/audio/hit.ogg';
import sfPoint from '../assets/audio/point.ogg';
import sfSwoosh from '../assets/audio/swooshing.ogg';
import sfWing from '../assets/audio/wing.ogg';

export default class Sfx {
  public static currentVolume = 1;

  public static async init() {
    await WebSfx.init();
  }

  public static volume(num: number): void {
    Sfx.currentVolume = num;
  }

  public static die(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfDie);
  }

  public static point(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfPoint);
  }

  public static hit(cb: IEmptyFunction): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfHit, cb);
  }

  public static swoosh(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfSwoosh);
  }

  public static wing(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfWing);
  }
}
