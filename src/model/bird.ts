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
import { clamp, flipRange, rescaleDim, sine as sineWave } from '../utils';
import ParentClass from '../abstracts/parent-class';
import Pipe from './pipe';
import Sfx from './sfx';
import SpriteDestructor from '../lib/sprite-destructor';
import SceneGenerator from './scene-generator';

export type IBirdColor = string;
export type IBirdRecords = Map<IBirdColor, HTMLImageElement>;

export default class Bird extends ParentClass {
  private static readonly FLAG_IS_ALIVE = 0b0001;
  private static readonly FLAG_DIED = 0b0010;
  private static readonly FLAG_DOES_LANDED = 0b0100;
  private flags: number;

  /**
   * Platform Height
   * */
  public static platformHeight = 0;

  /**
   * Score
   * */
  public score: number;

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
   * Calculated Fixed Force to lift
   * */
  private force: number;

  /**
   * Cause of death
   *
   * 0 - None
   * 1 - Fall
   * 2 - Collidde
   * */
  private causeOfDeath: number;

  private images: IBirdRecords;
  private color: IBirdColor;
  private lastCoord: number;
  private max_lift_velocity: number;
  private max_fall_velocity: number;

  constructor() {
    super();
    this.color = 'yellow';
    this.images = new Map<string, HTMLImageElement>();
    this.force = 0;
    this.scaled = {
      width: 0,
      height: 0
    };
    this.max_fall_velocity = 0;
    this.max_lift_velocity = 0;
    this.score = 0;
    this.rotation = 0;
    this.causeOfDeath = 0;
    this.flags = 0b0001;
    this.lastCoord = 0;
    this.wingState = 1;
  }

  /**
   * We Initialize the constructor of the object first while the assets
   * is still loading.
   *
   * We call this init() method after the all required
   * asset has been loaded.
   * */
  public init(): void {
    this.images.set('yellow.0', SpriteDestructor.asset('bird-yellow-up'));
    this.images.set('yellow.1', SpriteDestructor.asset('bird-yellow-mid'));
    this.images.set('yellow.2', SpriteDestructor.asset('bird-yellow-down'));
    this.images.set('blue.0', SpriteDestructor.asset('bird-blue-up'));
    this.images.set('blue.1', SpriteDestructor.asset('bird-blue-mid'));
    this.images.set('blue.2', SpriteDestructor.asset('bird-blue-down'));
    this.images.set('red.0', SpriteDestructor.asset('bird-red-up'));
    this.images.set('red.1', SpriteDestructor.asset('bird-red-mid'));
    this.images.set('red.2', SpriteDestructor.asset('bird-red-down'));

    Object.assign(SceneGenerator.birdColorList, ['yellow', 'red', 'blue']);
    this.use(SceneGenerator.bird);
  }

  private variableReset(): void {
    this.score = 0;
    this.rotation = 0;
    this.causeOfDeath = 0;
    this.flags = 0b0001;
    this.lastCoord = 0;
    this.wingState = 1;
  }

  public reset(): void {
    this.variableReset();
    this.resize(this.canvasSize);
    this.use(SceneGenerator.bird);
  }

  public get alive(): boolean {
    return (this.flags & Bird.FLAG_IS_ALIVE) !== 0;
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

    this.coordinate.y = Bird.platformHeight * 0.5;
    this.coordinate.x = width * BIRD_X_POSITION;

    this.force = height * BIRD_JUMP_HEIGHT;
    this.scaled = rescaleDim(BIRD_INITIAL_DIMENSION, {
      height: height * BIRD_HEIGHT
    });

    this.max_fall_velocity = this.canvasSize.height * BIRD_MAX_DOWN_VELOCITY;
    this.max_lift_velocity = this.canvasSize.height * BIRD_MAX_UP_VELOCITY;
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
    this.wingState = (1 + sineWave(speed, 2)) | 0;

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
    if (this.coordinate.y < 0 || (this.flags & Bird.FLAG_IS_ALIVE) === 0) {
      return;
    }

    Sfx.wing();
    this.velocity.y = this.force;
    this.lastCoord = this.coordinate.y;
  }

  /**
   * Check if the bird touches the platform
   * */
  private doesHitTheFloor(): boolean {
    return (
      this.coordinate.y + this.rotatedDimension().height >
      Math.abs(this.canvasSize.height - Bird.platformHeight)
    );
  }

  /**
   * Check if the bird collided with the pipes
   * */
  public isDead(pipes: Pipe[]): boolean {
    if (this.doesHitTheFloor()) {
      this.flags &= ~Bird.FLAG_IS_ALIVE;
      this.causeOfDeath = 1;
      return (this.flags & Bird.FLAG_IS_ALIVE) === 0;
    }

    const newDim = this.rotatedDimension();
    const boundary = newDim.width - newDim.height / 2;

    for (const pipe of pipes) {
      try {
        // Midpoint Holl Coordinate
        const hcx = pipe.coordinate.x;
        const hcy = pipe.coordinate.y;
        const radius = pipe.hollSize / 2; // Radius
        const width = Pipe.pipeSize.width / 2; // Half Size

        // Skip past pipe
        // ---------- Out
        if (hcx + width < this.coordinate.x - boundary) continue;

        // Is Inside of Pipes?
        // In ----------
        if (Math.abs(hcx - width) <= this.coordinate.x + boundary) {
          // Will get score after passing the
          // center width of pipe
          if (hcx < this.coordinate.x && !pipe.isPassed) {
            this.score++;
            Sfx.point();
            pipe.isPassed = true;
          }

          // Top Pipe ---------- Bottom Pipe
          if (
            Math.abs(hcy - radius) >= this.coordinate.y - newDim.height ||
            hcy + radius <= this.coordinate.y + newDim.height
          ) {
            this.flags &= ~Bird.FLAG_IS_ALIVE;
            this.causeOfDeath = 2;
            break;
          }
        }

        // Only the first pipe should be check
        break;
      } catch (err) {}
    }

    return (this.flags & Bird.FLAG_IS_ALIVE) === 0;
  }

  private rotatedDimension(): IDimension {
    const rad = (this.rotation * Math.PI) / 180;
    const w = this.scaled.width / 2;
    const h = this.scaled.height / 2;

    const sTheta = Math.sin(rad);
    const cTheta = Math.cos(rad);

    return {
      width: 2 * Math.sqrt(Math.pow(w * cTheta, 2) + Math.pow(h * sTheta, 2)),
      height: 2 * Math.sqrt(Math.pow(w * sTheta, 2) + Math.pow(h * cTheta, 2))
    };
  }

  /**
   * Play fall die sound once once the bird died
   */
  public playDead(): void {
    if ((this.flags & Bird.FLAG_DIED) !== 0) return;
    this.flags |= Bird.FLAG_DIED;
    if (this.causeOfDeath === 2) Sfx.die();
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
   * Handling Bird Rotation
   * */
  private handleRotation(): void {
    this.rotation += this.coordinate.y < this.lastCoord ? -7.2 : 6.5;
    this.rotation = clamp(BIRD_MIN_ROTATION, BIRD_MAX_ROTATION, this.rotation);

    if ((this.flags & Bird.FLAG_IS_ALIVE) === 0) {
      this.wingState = 1;
      return;
    }

    // Handle Flap Speed
    const birdMinRot = Math.abs(BIRD_MIN_ROTATION);
    const f = 4 + ((this.rotation + birdMinRot) / (birdMinRot + BIRD_MAX_ROTATION)) * 3.2;
    this.flapWing(flipRange(4, 8.2, f));
  }

  public Update(): void {
    // Always above the floor
    if (this.doesHitTheFloor() || (this.flags & Bird.FLAG_DOES_LANDED) !== 0) {
      this.flags |= Bird.FLAG_DOES_LANDED;

      this.coordinate.y =
        this.canvasSize.height - Bird.platformHeight - this.rotatedDimension().height;
      this.handleRotation();
      return;
    }

    // Add the Y velocity into Y coordinate but make sure we did not overspeed
    this.coordinate.y += clamp(
      this.max_lift_velocity,
      this.max_fall_velocity,
      this.velocity.y
    );

    // Slowly reduce the Y velocity by given weights
    this.velocity.y += this.canvasSize.height * BIRD_WEIGHT;

    this.handleRotation();
  }

  public Display(context: CanvasRenderingContext2D): void {
    const birdKeyString = `${this.color}.${this.wingState}`;

    // Save our previous created picture
    context.save();

    // Move the imaginary cursor into the bird position
    context.translate(this.coordinate.x, this.coordinate.y);

    // Rotate the context using the code above as mid point
    context.rotate((this.rotation * Math.PI) / 180);

    // Start the image at top-left then bottom-right
    context.drawImage(
      this.images.get(birdKeyString)!,
      -this.scaled.width,
      -this.scaled.height,
      this.scaled.width * 2,
      this.scaled.height * 2
    );

    // Restore the previously created picture but keeping the bird
    context.restore();
  }
}
