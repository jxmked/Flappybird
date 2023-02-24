import {
  BIRD_HEIGHT,
  BIRD_INITIAL_DIMENSION,
  BIRD_JUMP_HEIGHT,
  BIRD_MAX_DOWN_VELOCITY,
  BIRD_MAX_ROTATION,
  BIRD_MAX_UP_VELOCITY,
  BIRD_MIN_ROTATION,
  BIRD_WEIGHT,
  BIRD_X_POSITION
} from '../constants';
import { clamp, flipRange, lerp, rescaleDim, sine as sineWave } from '../utils';
import ParentClass from '../abstracts/parent-class';
import Pipe from './pipe';
import Sfx from './sfx';
import { asset } from '../lib/sprite-destructor';
import SceneGenerator from './scene-generator';

export type IBirdColor = string;
export type IBirdRecords = Map<IBirdColor, HTMLImageElement>;
export default class Bird extends ParentClass {
  /**
   * Platform Height
   * */
  public static platformHeight = 0;

  /**
   * Bird state
   * */
  public alive: boolean;

  /**
   * Score
   * */
  public score: number;

  /**
   * Will be use to play sound once dies
   * */
  private died: boolean;

  /**
   * 0 - Up
   * 1 - Mid
   * 2 - Down
   * */
  private wingState: number;

  /**
   * Scaled width and height
   * */
  private scaled: IDimension;

  /**
   * Bird Rotation (Degree)
   * */
  private rotation: number;

  /**
   * Calculated Fixed Force to up
   * */
  private force: number;

  /**
   * Cause of death
   * */
  private causeOfDeath: string;

  /**
   * Does touch the floor?
   * State
   */
  public doesLanded: boolean;

  private images: IBirdRecords;
  private color: IBirdColor;

  constructor() {
    super();
    this.color = 'yellow';
    this.images = new Map<string, HTMLImageElement>();
    this.died = false;

    this.alive = true;
    this.force = 0;
    this.score = 0;
    this.scaled = {
      width: 0,
      height: 0
    };
    this.rotation = 0;
    this.wingState = 1;
    this.causeOfDeath = 'none';
    this.doesLanded = false;
  }

  /**
   * We Initialize the constructor of the object first while the assets
   * is still loading.
   *
   * We call this init() method after the all required
   * asset has been loaded.
   * */
  public init(): void {
    this.images.set('yellow.0', asset('bird-yellow-up'));
    this.images.set('yellow.1', asset('bird-yellow-mid'));
    this.images.set('yellow.2', asset('bird-yellow-down'));
    this.images.set('blue.0', asset('bird-blue-up'));
    this.images.set('blue.1', asset('bird-blue-mid'));
    this.images.set('blue.2', asset('bird-blue-down'));
    this.images.set('red.0', asset('bird-red-up'));
    this.images.set('red.1', asset('bird-red-mid'));
    this.images.set('red.2', asset('bird-red-down'));

    Object.assign(SceneGenerator.birdColorList, ['yellow', 'red', 'blue']);
    this.use(SceneGenerator.bird);
  }

  public reset(): void {
    this.alive = true;
    this.score = 0;
    this.rotation = 0;
    this.doesLanded = false;
    this.causeOfDeath = 'none';
    this.died = false;
    this.resize(this.canvasSize);
    this.use(SceneGenerator.bird);
  }

  /**
   * Resizing canvas is pretty tricky but
   * to keep the position of the object
   * we do use percentages than pixels since percentages
   * does keep the position.
   *
   * */
  public resize({ width, height }: IDimension): void {
    super.resize({ width, height });

    this.coordinate.y = lerp(0, Bird.platformHeight, 0.5);
    this.coordinate.x = lerp(0, width, BIRD_X_POSITION);

    this.force = lerp(0, height, BIRD_JUMP_HEIGHT);
    this.scaled = rescaleDim(BIRD_INITIAL_DIMENSION, {
      height: lerp(0, height, BIRD_HEIGHT)
    });
  }

  /**
   * Do wave like thing using Sine wave
   *
   * @param ICoordinate
   * @param waveSpeed - frequency hz
   * @param amplitude - amplitude
   * */
  public doWave({ x, y }: ICoordinate, frequency: number, amplitude: number): void {
    this.flapWing(3);
    y += sineWave(frequency, amplitude);
    this.coordinate = { x, y };
  }

  /**
   * Flap wing using sine wave
   *
   * @param speed - flap speed
   * */
  private flapWing(speed: number): void {
    this.wingState = Math.round(1 + sineWave(speed, 1));

    // Make sure the wing is set to mid flap when the bird is falling
    if (this.rotation > 70) {
      this.wingState = 1;
    }
  }

  /**
   * Add lift to bird that slowly decrease by weight
   * */
  public flap(): void {
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
  private doesHitTheFloor(): boolean {
    return (
      this.coordinate.y + this.scaled.height >
      Math.abs(this.canvasSize.height - Bird.platformHeight)
    );
  }

  /**
   * Check if the bird collided with the pipes
   * */
  public isDead(pipes: Pipe[]): boolean {
    if (this.doesHitTheFloor()) {
      this.alive = false;
      this.causeOfDeath = 'fall';
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
        const radius = pipe.hollSize / 2; // Radius
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
            Math.abs(hcy - radius) >= posY - this.scaled.height ||
            hcy + radius <= posY + this.scaled.height
          ) {
            this.alive = false;
            this.causeOfDeath = 'collide';
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
  private getRotatedWidth(): number {
    const rad = (this.rotation * Math.PI) / 180;
    const res =
      Math.abs(this.scaled.width * Math.cos(rad)) +
      Math.abs(this.scaled.height * Math.sin(rad));
    return res > this.scaled.width ? this.scaled.width : res;
  }

  /**
   * Play Die sound once once the bird died
   */
  public playDead(): void {
    if (this.died) return;
    this.died = true;
    if (this.causeOfDeath === 'collide') Sfx.die();
  }

  /**
   * Change the color of the bird
   *
   * @param color string color of bird. (red | yellow | blue)
   */
  public use(color: IBirdColor): void {
    this.color = color;
  }

  /**
   * Get height and width based on rotation
   *
   * @returns New Dimension based on rotation
   */
  // private getRotatedDimension():IDimension {

  //   const radians = this.rotation * (Math.PI / 180);
  //   const a = this.scaled.width / 2;
  //   const b = this.scaled.height / 2;
  //   const rX = Math.sqrt((a * a * Math.sin(radians) * Math.sin(radians)) + (b * b * Math.cos(radians) * Math.cos(radians)));
  //   const rY = Math.sqrt((a * a * Math.cos(radians) * Math.cos(radians)) + (b * b * Math.sin(radians) * Math.sin(radians)));

  //   return {
  //     height: rY * Math.sin(radians) + rX * Math.cos(radians),
  //     width: rX * Math.sin(radians) + rY * Math.cos(radians)
  //   }
  // }

  public Update(): void {
    // Always above the floor
    if (this.doesHitTheFloor()) {
      this.doesLanded = true;
      // this.coordinate.y = (this.canvasSize.height - Bird.platformHeight) - this.getRotatedDimension().height * 1.5;
      return;
    }

    // Calculate the max drag & max lift velocities from given percentages
    const mx_down_velocity = lerp(0, this.canvasSize.height, BIRD_MAX_DOWN_VELOCITY);
    const mx_up_velocity = lerp(0, this.canvasSize.height, BIRD_MAX_UP_VELOCITY);

    // Add the Y velocity into Y coordinate but make sure we did not overspeed
    this.coordinate.y += clamp(mx_up_velocity, mx_down_velocity, this.velocity.y);

    // Slowly reduce the Y velocity by given weights
    this.velocity.y += lerp(0, this.canvasSize.height, BIRD_WEIGHT);

    // Rotate the bird base on its velocity.
    this.rotation += this.velocity.y - lerp(0, this.canvasSize.height, 0.0086);
    this.rotation = clamp(BIRD_MIN_ROTATION, BIRD_MAX_ROTATION, this.rotation);

    /**
     * Lets convert the rotation into percent but
     * the percent is in range of 4 - 8.2
     * */
    const rmx = Math.abs(BIRD_MIN_ROTATION) + BIRD_MAX_ROTATION;
    const f = 4 + ((this.rotation + Math.abs(BIRD_MIN_ROTATION)) / rmx) * 3.2;
    this.flapWing(flipRange(4, 8.2, f));
  }

  public Display(context: CanvasRenderingContext2D): void {
    const birdKeyString = `${this.color}.${this.wingState}`;

    const { x, y } = this.coordinate;

    // Save our previous created picture
    context.save();

    // Move the imaginary cursor into the bird position
    context.translate(x, y);

    // Rotate the context using the code above as mid point
    context.rotate((this.rotation * Math.PI) / 180);

    // Start the image at top-left then bottom-right
    context.drawImage(
      this.images.get(birdKeyString as IBirdColor)!,
      -this.scaled.width,
      -this.scaled.height,
      this.scaled.width * 2,
      this.scaled.height * 2
    );

    // Restore the previously created picture but keeping the bird
    context.restore();
  }
}
