import { GAME_SPEED, PIPE_HOLL_SIZE, PIPE_INITIAL_DIMENSION } from '../constants';
import { lerp, rescaleDim } from '../utils';
import ParentClass from '../abstracts/parent-class';
import { asset } from '../lib/sprite-destructor';
import SceneGenerator from './scene-generator';

export interface IPairPipe {
  top: HTMLImageElement | undefined;
  bottom: HTMLImageElement | undefined;
}

export interface IPipePairPosition {
  top: ICoordinate;
  bottom: ICoordinate;
}

export interface IPipeImages {
  red: IPairPipe;
  green: IPairPipe;
}

export interface IPipeScaled {
  top: IDimension;
  bottom: IDimension;
}

export default class Pipe extends ParentClass {
  /**
   *
   * */
  public static pipeSize: IDimension = {
    width: 0,
    height: 0
  };
  private pipeImg: IPipeImages;
  private img: undefined | IPairPipe;
  private scaled: IPipeScaled;
  public hollSize: number;
  public pipePosition: IPipePairPosition;
  public isPassed: boolean;

  constructor() {
    super();
    this.pipeImg = {
      red: {
        top: void 0,
        bottom: void 0
      },
      green: {
        top: void 0,
        bottom: void 0
      }
    };

    this.hollSize = 0;

    this.img = void 0;
    this.pipePosition = {
      top: { x: 0, y: 0 },
      bottom: { x: 0, y: 0 }
    };
    this.isPassed = false;
    this.velocity.x = GAME_SPEED;
    this.scaled = {
      top: { width: 0, height: 0 },
      bottom: { width: 0, height: 0 }
    };
  }

  public init(): void {
    this.pipeImg = {
      red: {
        top: asset('pipe-red-top')!,
        bottom: asset('pipe-red-bottom')!
      },
      green: {
        top: asset('pipe-green-top')!,
        bottom: asset('pipe-green-bottom')!
      }
    };
    Object.assign(SceneGenerator.pipeColorList, Object.keys(this.pipeImg));
  }

  /**
   * Set holl position
   * */
  public setHollPosition(coordinate: ICoordinate): void {
    // Positioning holl
    this.hollSize = lerp(0, this.canvasSize.height, PIPE_HOLL_SIZE);

    /**
     * The Logic is
     *
     * Center Point = hollposition + (hollSize / 2)
     * */
    // From 0 to top boundary
    this.coordinate = coordinate;
  }

  /**
   * Resize the pipe based on screen size.
   *
   * To keep the to its position, during resizing event,
   * we convert the current coordinates of holl position
   * into percentages then save it. After that we can now
   * set the new size of the screen.
   *
   * After everything is set convert the previously saved value
   * of position of holl to back to the pixel with new dimensions.
   *
   * Set update the value of coordinate and we're good to go.
   * */
  public resize({ width, height }: IDimension): void {
    // Save the coordinate of pipe holl before resizing the canvas sizes
    const oldX = (this.coordinate.x / this.canvasSize.width) * 100;
    const oldY = (this.coordinate.y / this.canvasSize.height) * 100;

    super.resize({ width, height });

    // Update Pipe Size
    const min = lerp(0, this.canvasSize.width, 0.18);
    Pipe.pipeSize = rescaleDim(PIPE_INITIAL_DIMENSION, { width: min });

    // Resize holl size
    this.hollSize = lerp(0, this.canvasSize.height, PIPE_HOLL_SIZE);

    // Relocate the pipe holl
    this.coordinate.x = lerp(0, width, oldX / 100);
    this.coordinate.y = lerp(0, height, oldY / 100);

    // Update velocity. Converting percentages to pixels
    this.velocity.x = lerp(0, width, GAME_SPEED);

    this.scaled.top = rescaleDim(
      {
        width: this.img!.top!.width,
        height: this.img!.top!.height
      },
      { width: min }
    );

    this.scaled.bottom = rescaleDim(
      {
        width: this.img!.bottom!.width,
        height: this.img!.bottom!.height
      },
      { width: min }
    );
  }

  /**
   * Check if the pipe is out of canvas.
   * We're going to remove it to keep the game performance
   * good enough
   * */
  public isOut(): boolean {
    return this.coordinate.x + Pipe.pipeSize.width < 0;
  }

  /**
   * Pipe color selection
   * */
  public use(select: keyof IPipeImages): void {
    this.img = this.pipeImg[select]!;
  }

  /**
   * Pipe Update
   * */
  public Update(): void {
    this.coordinate.x -= this.velocity.x;
  }

  public Display(context: CanvasRenderingContext2D): void {
    const width = Pipe.pipeSize.width / 2;

    const posX = this.coordinate.x;
    const posY = this.coordinate.y;
    const radius = this.hollSize / 2;

    /**
     * To draw off canvas, subtract the height of pipe to holl position.
     * The result should be the height of pipe that we don't need or out of canvas
     * Then pass the result to the function height parameter as negative value.
     *
     * And thats it for the top pipe
     * */

    context.drawImage(
      this.img!.top!,
      posX - width,
      -(this.scaled.top.height - Math.abs(posY - radius)),
      this.scaled.top.width,
      this.scaled.top.height
    );

    context.drawImage(
      this.img!.bottom!,
      posX - width,
      posY + radius,
      this.scaled.bottom.width,
      this.scaled.bottom.height
    );
  }
}
