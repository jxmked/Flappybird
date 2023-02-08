import sfDie from '../assets/audio/die.ogg';
import sfHit from '../assets/audio/hit.ogg';
import sfPoint from '../assets/audio/point.ogg';
import sfSwoosh from '../assets/audio/swoosh.ogg';
import sfWing from '../assets/audio/wing.ogg';

import WebSfx from '../lib/web-sfx';

export default class Sfx {
  private static currentVolume = 1;

  constructor() {}

  init() {
    WebSfx.init();
  }

  static volume(num: number): void {
    Sfx.currentVolume = num;
  }

  static die(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfDie);
  }

  static point(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfPoint);
  }

  static hit(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfHit);
  }

  static swoosh(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfSwoosh);
  }

  static wing(): void {
    WebSfx.volume(Sfx.currentVolume);
    WebSfx.play(sfWing);
  }
}
