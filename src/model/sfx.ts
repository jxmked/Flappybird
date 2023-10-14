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
    WebSfx.play(sfDie as string);
  }

  public static point(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfPoint as string);
  }

  public static hit(cb: Function): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfHit as string, cb);
  }

  public static swoosh(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfSwoosh as string);
  }

  public static wing(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfWing as string);
  }
}
