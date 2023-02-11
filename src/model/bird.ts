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
   * Bird Rotation (Degree)
   * -40 - 90
   * */
  rotation: number;

  /**
   * waiting | up | down
   */
  birdState: string;

  /**
   * Target Position every jump
   */
  targetY: number;

  /**
   * Weight
   */
  static weight: number = 3;

  /**
   * Height of jump
   */
  jump: number;

  constructor() {
    this.targetY = 0;
    this.jump = 0;
    this.birdState = 'waiting';
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
    this.rotation = 90;
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

    const boundary = this.getRotatedWidth() - this.scaled.height / 2;
    for (const pipe of pipes) {
      try {
        // Midpoint Holl Coordinate
        const hcx = pipe.coordinate.x;
        const hcy = pipe.coordinate.y;
        const size = pipe.hollSize / 2; // Radius
        const width = Pipe.pipeSize.width / 2; // Half Size

        // Skip past pipe
        // ---------- Out
        if (hcx + width < posX - boundary) continue;

        // Is Inside of Pipes?
        // In ----------
        if (Math.abs(hcx - width) <= posX + boundary) {
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

  /**
   * Get the new width of an oval/ellipse shape based on angle
   *
   * @returns new width based on rotation
   */
  getRotatedWidth(): number {
    const rad = (this.rotation * Math.PI) / 180;
    const res = Math.abs(this.scaled.width * Math.cos(rad)) + Math.abs(this.scaled.height * Math.sin(rad));
    return res > this.scaled.width ? this.scaled.width : res;
  }

  /**
   * Play Die sound once once the bird died
   */
  playDead(): void {
    if (this.died) return;
    Sfx.die();
    this.died = true;
  }

  /**
   * Change the color of the bird
   *
   * @param color string color of bird. (red | yellow | blue)
   */
  use(color: IBirdColors): void {
    this.birdImg = this.birdColorObject[color as keyof typeof this.birdColorObject];
  }

  Update(): void {
    // Always above the floor
    if (this.doesHitTheFloor()) return;

    this.props.gravity += this.velocity.y;
    this.coordinate.y += clamp(-10, 20, this.props.gravity);

    this.rotation += this.props.gravity - 5;
    this.rotation = clamp(-40, 90, this.rotation);

    if (this.rotation > 70) {
      this.props.flapState = 1;
    }
  }

  changeFlapState(): void {
    if (this.props.flapState < 0) {
      this.props.flapState = 1;
    }
  }

  Display(context: CanvasRenderingContext2D): void {
    const flapArr = ['up', 'mid', 'down'] as keyof typeof this.birdImg;

    let { x, y } = this.coordinate;
    let flapState = this.props.flapState;

    const img: HTMLImageElement = this.birdImg![flapArr[flapState]];
    context.beginPath();
    context.save();
    context.translate(x, y);
    context.rotate((this.rotation * Math.PI) / 180);
    context.translate(-this.scaled.width, -this.scaled.height);
    context.drawImage(img, 0, 0, this.scaled.width * 2, this.scaled.height * 2);
    context.restore();
    context.closePath();
  }
}
