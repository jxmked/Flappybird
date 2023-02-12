import ParentClass from '../abstracts/parent-class';

import { asset, lerp, rescaleDim, clamp, BackNForthCounter } from '../utils';
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

import {
  BIRD_JUMP_HEIGHT,
  BIRD_X_POSITION,
  BIRD_MAX_ROTATION,
  BIRD_MIN_ROTATION,
  BIRD_HEIGHT,
  BIRD_INITIAL_DIMENSION,
  BIRD_WEIGHT,
  BIRD_MAX_UP_VELOCITY,
  BIRD_MAX_DOWN_VELOCITY,
  BIRD_DEFAULT_COLOR
} from '../constants';

export interface IBirdObject {
  up: HTMLImageElement;
  mid: HTMLImageElement;
  down: HTMLImageElement;
}

export interface IBirdImages {
  yellow: IBirdObject;
  red: IBirdObject;
  blue: IBirdObject;
}

export type IBirdColors = 'yellow' | 'red' | 'blue';

export default class Bird extends ParentClass {
  /**
   * Platform Height
   * */
  static platformHeight = 0;

  /**
   * Bird color selections
   * */
  birdColorObject: IBirdImages;

  /**
   * Bird Images
   * */
  birdImg: undefined | IBirdObject;

  /**
   * Bird state
   * */
  alive: boolean;

  /**
   * Score
   * */
  score: number;

  /**
   * Will be use to play sound once dies
   * */
  died: boolean;

  /**
   * 0 - Up
   * 1 - Mid
   * 2 - Down
   * */
  wingState: number;

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
   * */
  rotation: number;

  /**
   * A state changer for wings
   * */
  backNForth: BackNForthCounter;

  /**
   * Calculated Fixed Force to up
   * */
  force: number;

  constructor() {
    super();

    this.died = false;
    this.birdColorObject = {
      yellow: {
        up: new Image(),
        mid: new Image(),
        down: new Image()
      },
      blue: {
        up: new Image(),
        mid: new Image(),
        down: new Image()
      },
      red: {
        up: new Image(),
        mid: new Image(),
        down: new Image()
      }
    };
    this.alive = true;
    this.force = 0;
    this.birdImg = void 0;
    this.score = 0;
    this.height = 0;
    this.scaled = {
      width: 0,
      height: 0
    };
    this.rotation = 0;
    this.wingState = 1;
    this.backNForth = new BackNForthCounter(0, 100, [
      [0, 10],
      [45, 55],
      [90, 100]
    ]);
    this.backNForth.speed(30);
  }

  /**
   * We Initialize the constructor of the object first while the assets
   * is still loading.
   *
   * We call this init() method after the all required
   * asset has been loaded.
   * */
  init(): void {
    this.birdColorObject = {
      yellow: {
        up: asset(birdYellowUpFlap as string) as HTMLImageElement,
        mid: asset(birdYellowMidFlap as string) as HTMLImageElement,
        down: asset(birdYellowDownFlap as string) as HTMLImageElement
      },
      blue: {
        up: asset(birdBlueUpFlap as string) as HTMLImageElement,
        mid: asset(birdBlueMidFlap as string) as HTMLImageElement,
        down: asset(birdBlueDownFlap as string) as HTMLImageElement
      },
      red: {
        up: asset(birdRedUpFlap as string) as HTMLImageElement,
        mid: asset(birdRedMidFlap as string) as HTMLImageElement,
        down: asset(birdRedDownFlap as string) as HTMLImageElement
      }
    };

    this.use(BIRD_DEFAULT_COLOR);
  }

  /**
   * Resizing canvas is pretty tricky but
   * to keep the position of the object
   * we do use percentages than pixels since percentages
   * does keep the position.
   *
   * */
  resize({ width, height }: IDimension): void {
    super.resize({ width, height });

    this.coordinate.y = lerp(0, Bird.platformHeight, 0.5);
    this.coordinate.x = lerp(0, width, BIRD_X_POSITION);
    this.height = lerp(0, Bird.platformHeight, BIRD_HEIGHT);

    this.force = lerp(0, height, BIRD_JUMP_HEIGHT);
    this.scaled = rescaleDim(BIRD_INITIAL_DIMENSION, { height: this.height });
  }

  /**
   * Add lift to bird that slowly decrease by weight
   * */
  flap(): void {
    // Prevent flapping when the height of bird is
    // at the very top of canvas or the bird is not alive
    if (this.coordinate.y < 0 || !this.alive) {
      return;
    }

    Sfx.wing();
    this.velocity.y = this.force;
  }

  /**
   * Check if the bird touches the platform
   * */
  doesHitTheFloor(): boolean {
    return (
      this.coordinate.y + this.scaled.height >
      Math.abs(this.canvasSize.height - Bird.platformHeight)
    );
  }

  /**
   * Check if the bird collided with the pipes
   * */
  isDead(pipes: Pipe[]): boolean {
    if (this.doesHitTheFloor()) {
      this.alive = false;
      return !this.alive;
    }

    const posX = this.coordinate.x;
    const posY = this.coordinate.y;
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
          if (
            Math.abs(hcy - size) >= posY - this.scaled.height ||
            hcy + size <= posY + this.scaled.height
          ) {
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
    const res =
      Math.abs(this.scaled.width * Math.cos(rad)) +
      Math.abs(this.scaled.height * Math.sin(rad));
    return res > this.scaled.width ? this.scaled.width : res;
  }

  /**
   * Play Die sound once once the bird died
   */
  playDead(): void {
    if (this.died) return;
    this.died = true;
    Sfx.die();
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

    // Calculate the max drag & max lift velocities from given percentages
    const mx_down_velocity = lerp(0, this.canvasSize.height, BIRD_MAX_DOWN_VELOCITY);
    const mx_up_velocity = lerp(0, this.canvasSize.height, BIRD_MAX_UP_VELOCITY);

    // Add the Y velocity into Y coordinate but make sure we did not overspeed
    this.coordinate.y += clamp(mx_up_velocity, mx_down_velocity, this.velocity.y);

    // Slowly reduce the Y velocity by given weights
    this.velocity.y += lerp(0, this.canvasSize.height, BIRD_WEIGHT);

    // Rotate the bird base on its velocity. The faster the more lift it takes
    this.rotation += this.velocity.y - 10;
    this.rotation = clamp(BIRD_MIN_ROTATION, BIRD_MAX_ROTATION, this.rotation);

    // Update our back and forth utilty.
    // This function will help our bird tk wave its wings
    this.backNForth.Update();

    // Update wing state
    this.wingState = this.backNForth.getStop();

    // Make sure the wing is set to mid flap when the bird is falling
    if (this.rotation > 70) {
      this.wingState = 1;
    }
  }

  Display(context: CanvasRenderingContext2D): void {
    const flapArr = ['up', 'mid', 'down'] as keyof typeof this.birdImg;
    const img: HTMLImageElement = this.birdImg![flapArr[this.wingState]];
    const { x, y } = this.coordinate;

    // Save our previous created picture
    context.save();

    // Move the imaginary cursor into the bird position
    context.translate(x, y);

    // Rotate the context using the code above as mid point
    context.rotate((this.rotation * Math.PI) / 180);

    /* Code below is just printing the bird. */

    context.translate(-this.scaled.width, -this.scaled.height);
    context.drawImage(img, 0, 0, this.scaled.width * 2, this.scaled.height * 2);

    // Restore the previously created picture but keeping the bird
    context.restore();
  }
}
