import { asset, lerp, rescaleDim, clamp } from '../utils';
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
  height: number;
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

  /**
   * height to match with.
   *
   * We rely on height instead of width because of
   * top and bottom pipe gap
   * */
  height: number;

  /**
   * Scaled width and height
   * */
  scaled: IDimension;

  /**
   * Bird Rotation
   * -5 - 20
   * */
  rotation: number;

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
      width: 34,
      flapState: 1,
      height: 24
    };

    this.canvasSize = {
      width: 0,
      height: 0
    };
    this.platformHeight = 0;
    this.score = 0;
    this.height = 0;
    this.scaled = {
      width: 0,
      height: 0
    };
    this.rotation = 0;
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

    this.coordinate.x = lerp(0, width, 0.15);
    this.velocity.y = lerp(0, height, 0.0003);
    this.props.jump = -lerp(0, height, 0.008);
    this.height = lerp(0, height, 0.024);

    this.scaled = rescaleDim(
      {
        width: this.props.width,
        height: this.props.height
      },
      { height: this.height }
    );
  }

  flap(): void {
    if (this.coordinate.y < 0 || !this.alive) {
      return;
    }
    Sfx.wing();
    this.props.gravity = this.props.jump;
  }

  doesHitTheFloor(): boolean {
    return this.coordinate.y + this.scaled.height > Math.abs(this.canvasSize.height - this.platformHeight);
  }

  isDead(pipes: Pipe[]): boolean {
    const posX = this.coordinate.x;
    const posY = this.coordinate.y;

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
        if (hcx + width < posX - this.scaled.width) continue;

        // Is Inside of Pipes?
        // In ----------
        if (Math.abs(hcx - width) <= posX + this.scaled.width) {
          // Will get score after passing the
          // center width of pipe
          if (hcx < posX && !pipe.isPassed) {
            this.score++;
            Sfx.point();
            pipe.isPassed = true;
          }

          // Top Pipe ---------- Bottom Pipe
          if (Math.abs(hcy - size) >= posY - this.scaled.height || hcy + size <= posY + this.scaled.height) {
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

    this.props.gravity = clamp(-5, 20, this.props.gravity);
  }

  Display(context: CanvasRenderingContext2D): void {
    const flapArr = ['up', 'mid', 'down'] as keyof typeof this.birdImg;

    let { x, y } = this.coordinate;
    const { gravity, flapState } = this.props;

    context.beginPath();
    //context.arc(x, y, this.radius, 0, Math.PI * 2);
    context.ellipse(x, y, this.scaled.width, this.scaled.height, 0, 0, Math.PI * 2);
    context.fillStyle = this.ballColor;
    context.fill();
    context.closePath();

    const img: HTMLImageElement = this.birdImg![flapArr[flapState]];
    context.beginPath();
    context.save();
    context.translate(x, y);
    context.rotate(((Math.PI / 2) * this.rotation) / 20);
    context.translate(-this.scaled.width, -this.scaled.height);
    context.drawImage(img, 0, 0, this.scaled.width * 2, this.scaled.height * 2);
    context.restore();
    context.closePath();
  }
}
