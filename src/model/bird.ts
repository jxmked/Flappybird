import { asset } from '../utils';
import birdYellowMidFlap from '../assets/sprites/bird/yellow-mid-flap.png';
import birdYellowDownFlap from '../assets/sprites/bird/yellow-down-flap.png';
import birdRedUpFlap from '../assets/sprites/bird/red-up-flap.png';
import birdRedMidFlap from '../assets/sprites/bird/red-mid-flap.png';
import birdRedDownFlap from '../assets/sprites/bird/red-down-flap.png';
import birdBlueUpFlap from '../assets/sprites/bird/blue-up-flap.png';
import birdBlueMidFlap from '../assets/sprites/bird/blue-mid-flap.png';
import birdBlueDownFlap from '../assets/sprites/bird/blue-down-flap.png';
import birdYellowUpFlap from '../assets/sprites/bird/yellow-up-flap.png';
import Sfx from './sfx';

interface IBirdObject {
  up: HTMLImageElement;
  mid: HTMLImageElement;
  down: HTMLImageElement;
}

type IBirdColors = 'yellow' | 'red' | 'blue';
export default class Bird {
  birdColorObject: { [key: string]: IBirdObject };
  color: IBirdColors;
  birdImg: undefined | IBirdObject;
  constructor() {
    this.birdColorObject = {};
    this.color = 'yellow';
    this.birdImg = void 0;
  }

  init(): void {
    this.birdColorObject = {
      yellow: {
        up: asset(birdYellowUpFlap),
        mid: asset(birdYellowMidFlap),
        down: asset(birdYellowDownFlap)
      },
      blue: {
        up: asset(birdBlueUpFlap),
        mid: asset(birdBlueMidFlap),
        down: asset(birdBlueDownFlap)
      },
      red: {
        up: asset(birdRedUpFlap),
        mid: asset(birdRedMidFlap),
        down: asset(birdRedDownFlap)
      }
    };

    this.use('yellow');
  }

  flap(): void {
    Sfx.wing();
  }

  isDead(): boolean {
    return false;
  }

  playDead(): void {
    Sfx.die();
  }

  use(color: IBirdColors): void {
    this.birdImg = this.birdColorObject[color as keyof typeof this.birdColorObject];
  }

  Update(): void {}

  Display(context: CanvasRenderingContext2D): void {}
}
