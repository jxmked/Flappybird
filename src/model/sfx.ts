import sfDie from '../assets/audio/die.ogg';
import sfHit from '../assets/audio/hit.ogg';
import sfPoint from '../assets/audio/point.ogg';
import sfSwoosh from '../assets/audio/swooshing.ogg';
import sfWing from '../assets/audio/wing.ogg';

import WebSfx from '../lib/web-sfx';

export default class Sfx {
  private static currentVolume = 1;

  static async init() {
    await WebSfx.init();
  }

  static volume(num: number): void {
    Sfx.currentVolume = num;
  }

  static die(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfDie as string);
  }

  static point(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfPoint as string);
  }

  static hit(cb:Function): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfHit as string, cb);
  }

  static swoosh(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfSwoosh as string);
  }

  static wing(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfWing as string);
  }
}
