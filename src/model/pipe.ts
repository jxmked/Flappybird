import ParentClass from '../abstracts/parent-class';

import { asset } from '../lib/sprite-destructor';
import { rescaleDim, lerp } from '../utils';
import {
  PIPE_HOLL_SIZE,
  GAME_SPEED,
  PIPE_INITIAL_DIMENSION,
  PIPE_COLOR
} from '../constants';

export interface IPairPipe {
  top: HTMLImageElement;
  bottom: HTMLImageElement;
}

export interface IPipePairPosition {
  top: ICoordinate;
  bottom: ICoordinate;
}

export interface IPipeImages {
  red: IPairPipe;
  green: IPairPipe;
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
  public hollSize: number;
  public pipePosition: IPipePairPosition;
  public isPassed: boolean;

  constructor() {
    super();
    this.pipeImg = {
      red: {
        top: new Image(),
        bottom: new Image()
      },
      green: {
        top: new Image(),
        bottom: new Image()
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

    this.use(PIPE_COLOR);
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
    // I'm getting a problem when i am using lerp() for this.
    this.coordinate.x = lerp(0, width, oldX / 100);
    this.coordinate.y = lerp(0, height, oldY / 100);

    // Update velocity. Converting percentages to pixels
    this.velocity.x = lerp(0, width, GAME_SPEED);
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
  public use(select: 'green' | 'red'): void {
    this.img = this.pipeImg[select];
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

    // For Top pipe
    const topImgDim = rescaleDim(
      {
        width: this.img!.top.width,
        height: this.img!.top.height
      },
      { width: width * 2 }
    );

    // For Bottom Pipe
    const botImgDim = rescaleDim(
      {
        width: this.img!.bottom.width,
        height: this.img!.bottom.height
      },
      { width: width * 2 }
    );

    /**
     * To draw off canvas, subtract the height of pipe to holl position.
     * The result should be the height of pipe that we don't need or out of canvas
     * Then pass the result to the function height parameter as negative value.
     *
     * And thats it for the top pipe
     * */

    context.drawImage(
      this.img!.top,
      posX - width,
      -(topImgDim.height - Math.abs(posY - radius)),
      topImgDim.width,
      topImgDim.height
    );

    context.drawImage(
      this.img!.bottom,
      posX - width,
      posY + radius,
      botImgDim.width,
      botImgDim.height
    );
  }
}
