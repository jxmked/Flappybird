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
  width: number;
  flapState: number; // Array(Up, Mid, Down)
}

export default class Bird {
  birdColorObject: { [key: string]: IBirdObject };
  color: IBirdColors;
  birdImg: undefined | IBirdObject;
  props: IProps;
  canvasSize: IDimension;
  platformHeight: number;

  radius: number;
  alive: boolean;
  velocity: IVelocity;
  score: number;
  coordinate: ICoordinate;
  died: boolean;
  ballColor: string;

  constructor() {
    this.radius = 10;
    this.died = false;
    this.coordinate = {
      x: 0,
      y: 0
    };
    this.birdColorObject = {};
    this.alive = true;
    this.color = 'yellow';
    this.birdImg = void 0;
    this.ballColor = 'yellow';
    this.velocity = {
      x: 0,
      y: 0
    };
    this.props = {
      gravity: 0,
      jump: -6,
      width: 0, // Define the width and the image automatically scale up to that
      flapState: 1
    };

    this.canvasSize = {
      width: 0,
      height: 0
    };
    this.platformHeight = 0;
    this.score = 0;
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
    this.coordinate.x = lerp(0, width, 0.15);
    this.velocity.y = lerp(0, height, 0.0003);
    this.props.jump = -lerp(0, height, 0.008);
  }

  flap(): void {
    if (this.coordinate.y < 0 || !this.alive) {
      return;
    }
    Sfx.wing();
    this.props.gravity = this.props.jump;
  }

  doesHitTheFloor(): boolean {
    return this.coordinate.y + this.radius * 2 > Math.abs(this.canvasSize.height - this.platformHeight);
  }

  isDead(pipes: Pipe[]): boolean {
    const posX = this.coordinate.x;
    const posY = this.coordinate.y;
    // I don't know why diameter but it works
    const diameter = this.radius * 2;

    if (this.doesHitTheFloor()) {
      this.alive = false;
      return !this.alive;
    }

    for (const pipe of pipes) {
      try {
        // Midpoint Holl Coordinate
        const hcx = pipe.coordinate.x;
        const hcy = pipe.coordinate.y;
        const size = pipe.hollSize / 2; // Radius
        const width = Pipe.pipeSize.width / 2; // Half Size

        // Skip past pipe
        // ---------- Out
        if (hcx + width < posX - this.radius) continue;

        // Is Inside of Pipes?
        // In ----------
        if (Math.abs(hcx - width) <= posX + this.radius) {
          // Will get score after passing the
          // center width of pipe
          if (hcx < posX && !pipe.isPassed) {
            this.score++;
            Sfx.point();
            pipe.isPassed = true;
          }

          // Top Pipe ---------- Bottom Pipe
          if (Math.abs(hcy - size) >= posY - diameter || hcy + size <= posY + diameter) {
            this.alive = false;
            break;
          }
        }

        // Only the first pipe should be check

        break;
      } catch (err) {}
    }

    return !this.alive;
  }

  playDead(): void {
    if (this.died) return;
    Sfx.die();
    this.died = true;
  }

  use(color: IBirdColors): void {
    this.birdImg = this.birdColorObject[color as keyof typeof this.birdColorObject];
  }

  Update(): void {
    if (this.doesHitTheFloor()) {
      return;
    }
    this.props.gravity += this.velocity.y;
    this.coordinate.y += this.props.gravity;
  }

  Display(context: CanvasRenderingContext2D): void {
    const ctx = context;
    const flapArr = ['up', 'mid', 'down'] as keyof typeof this.birdImg;

    let { x, y } = this.coordinate;
    const { width, gravity, flapState } = this.props;

    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.ballColor;
    ctx.fill();
    ctx.closePath();

    //return;
    const img: HTMLImageElement = this.birdImg![flapArr[flapState]];
    const resized = rescaleDim(
      {
        width: img.width,
        height: img.height
      },
      { width }
    );
    // this.rescaledImg = resized;

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
