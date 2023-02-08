import { asset, lerp, rescaleDim } from '../utils';
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
import Pipe from './pipe';

export interface IBirdObject {
  up: HTMLImageElement;
  mid: HTMLImageElement;
  down: HTMLImageElement;
}

export type IBirdColors = 'yellow' | 'red' | 'blue';

export interface IProps {
  gravity: number;
  jump: number;
  position: ICoordinate;
  width: number;
  flapState: number; // Array(Up, Mid, Down)
}

export default class Bird {
  birdColorObject: { [key: string]: IBirdObject };
  color: IBirdColors;
  birdImg: undefined | IBirdObject;
  props: IProps;
  canvasSize: IDimension;
  velocity: IVelocity;
  platformHeight: number;
  rescaledImg: IDimension;
  alive: boolean;

  constructor() {
    this.birdColorObject = {};
    this.alive = true;
    this.color = 'yellow';
    this.birdImg = void 0;
    this.velocity = {
      x: 0,
      y: 0
    };
    this.props = {
      gravity: 0,
      jump: -6,
      position: {
        x: 0,
        y: 0
      },
      width: 0, // Define the width and the image automatically scale up to that
      flapState: 1
    };

    this.canvasSize = {
      width: 0,
      height: 0
    };
    this.platformHeight = 0;
    this.rescaledImg = {
      width: 0,
      height: 0
    };
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

  resize({ width, height }: IDimension): void {
    this.canvasSize = { width, height };
    this.props.width = lerp(0, width, 0.11);
    this.props.position.x = lerp(0, width, 0.15);
    this.velocity.y = lerp(0, height, 0.0003);
    this.props.jump = -lerp(0, height, 0.008);
  }

  flap(): void {
    console.log(this.props.position, this.canvasSize.height);
    if (this.props.position.y < 0) {
      return;
    }
    Sfx.wing();
    this.props.gravity = this.props.jump;
  }

  isDead(pipes: Pipe[]): boolean {
    const posX = this.props.position.x;
    const posY = this.props.position.y;

    if (posY > Math.abs(this.canvasSize.height - this.platformHeight - this.rescaledImg.height)) {
      Sfx.hit();
      this.alive = false;
      this.use('red');
      return !this.alive;
    }

    for (const pipe of pipes) {
      try {
        const { x, y } = pipe.pipePosition.top;
        const { width, height } = pipe.pipeSize;

        if (x - width > posX) {
          this.use('red');
        }
      } catch (err) {}
    }
    return !this.alive;
  }

  playDead(): void {
    Sfx.die();
  }

  use(color: IBirdColors): void {
    this.birdImg = this.birdColorObject[color as keyof typeof this.birdColorObject];
  }

  Update(): void {
    if (!this.alive) return;
    this.props.gravity += this.velocity.y;
    this.props.position.y += this.props.gravity;
  }

  Display(context: CanvasRenderingContext2D): void {
    const flapArr = ['up', 'mid', 'down'] as keyof typeof this.birdImg;

    let { x, y } = this.props.position;
    const { width, gravity, flapState } = this.props;
    const img: HTMLImageElement = this.birdImg![flapArr[flapState]];
    const resized = rescaleDim(
      {
        width: img.width,
        height: img.height
      },
      { width }
    );
    this.rescaledImg = resized;

    context.beginPath();
    context.arc(x, y, 10, 0, Math.PI * 2);
    context.fillStyle = 'blue';
    context.fill();
    context.closePath();

    const xPos = resized.width / 2;
    const yPos = resized.height / 2;

    context.save();
    context.translate(x, y);
    context.translate(xPos, yPos);

    // Rotate Based On Gravity
    context.rotate(((Math.PI / 2) * gravity) / 20);

    context.drawImage(img, -xPos, -yPos, resized.width, resized.height);

    context.restore();
  }
}
