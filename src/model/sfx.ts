import sfDie from '../assets/audio/die.ogg';
import sfHit from '../assets/audio/hit.ogg';
import sfPoint from '../assets/audio/point.ogg';
import sfSwoosh from '../assets/audio/swoosh.ogg';
import sfWing from '../assets/audio/wing.ogg';

//import UIFX from 'uifx';

import sfx from '../lib/web-sfx';

export default class Sfx {
  //static sounds: { [key: string]: UIFX };

  constructor() {
    //  Sfx.sounds = {};
  }

  init() {
    /* Sfx.sounds = {
      die: new UIFX(sfDie, { throttleMs: 100 }),
      hit: new UIFX(sfHit, { throttleMs: 100 }),
      point: new UIFX(sfPoint, { throttleMs: 100 }),
      swoosh: new UIFX(sfSwoosh, { throttleMs: 100 }),
      wing: new UIFX(sfWing, { throttleMs: 100 })
    };

    Sfx.volume(1); */
  }

  static volume(num: number): void {
    /*  for (const index in Sfx.sounds) {
      Sfx.sounds[index].setVolume(num);
    } */
  }

  static die(): void {
    sfx.play('die');
  }

  static point(): void {
    sfx.play('point');
  }

  static hit(): void {
    sfx.play('hit');
  }

  static swoosh(): void {
    sfx.play('swoosh');
  }

  static wing(): void {
    sfx.play('wing');
  }
}
