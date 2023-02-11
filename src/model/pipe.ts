import { asset } from '../utils';
import pipeTopGreen from '../assets/sprites/pipe/top-green.png';
import pipeBottomRed from '../assets/sprites/pipe/bottom-red.png';
import pipeBottomGreen from '../assets/sprites/pipe/bottom-green.png';
import pipeTopRed from '../assets/sprites/pipe/top-red.png';
import { rescaleDim, lerp } from '../utils';

export interface IPairPipe {
  top: HTMLImageElement;
  bottom: HTMLImageElement;
}

export interface IPipePairPosition {
  top: ICoordinate;
  bottom: ICoordinate;
}

export default class Pipe {
  velocity: IVelocity;

  /**
   * x = X Transition
   * y = Holl Position
   */
  coordinate: ICoordinate;
  canvasSize: IDimension;
  static pipeSize: IDimension = {
    width: 100,
    height: 300
  };
  pipeImg: { [key: string]: IPairPipe };
  img: undefined | IPairPipe;
  hollSize: number;
  pipePosition: IPipePairPosition;
  isPassed: boolean;

  untouchedHollsize: number;
  constructor() {
    // Percentage
    this.velocity = { x: 0.002, y: 0 };

    // Holl Position
    this.coordinate = { x: 0, y: 0 };

    // The original hollsize, (The Percentage)
    this.untouchedHollsize = 0;
    this.canvasSize = {
      width: 0,
      height: 0
    };
    this.pipeImg = {};

    this.hollSize = 0;

    this.img = void 0;
    this.pipePosition = {
      top: { x: 0, y: 0 },
      bottom: { x: 0, y: 0 }
    };
    this.isPassed = false;
  }

  init(): void {
    this.pipeImg = {
      red: {
        top: asset(pipeTopRed),
        bottom: asset(pipeBottomRed)
      },
      green: {
        top: asset(pipeTopGreen),
        bottom: asset(pipeBottomGreen)
      }
    };

    this.use('green');
  }

  setHollPosition(coordinate: ICoordinate, hollSize: number): void {
    // Positioning holl
    this.hollSize = lerp(0, this.canvasSize.height, hollSize);
    this.untouchedHollsize = hollSize;

    /**
     * The Logic is
     *
     * Center Point = hollposition + (hollSize / 2)
     * */
    // From 0 to top boundary
    this.coordinate = coordinate;
  }

  resize({ width, height }: IDimension): void {
    // Save the coordinate of pipe holl
    const oldX = (this.coordinate.x / this.canvasSize.width) * 100;
    const oldY = (this.coordinate.y / this.canvasSize.height) * 100;

    this.canvasSize.width = width;
    this.canvasSize.height = height;

    // Update Pipe Size
    const min = lerp(0, this.canvasSize.width, 0.18);
    Pipe.pipeSize = rescaleDim(Pipe.pipeSize, { width: min });

    // Resize holl size
    this.hollSize = lerp(0, this.canvasSize.height, this.untouchedHollsize);

    //  Relocate the pipe holl
    // I'm getting a problem when i am using lerp() for this.
    this.coordinate.x = (oldX * this.canvasSize.width) / 100;
    this.coordinate.y = (oldY * this.canvasSize.height) / 100;
  }

  isOut(): boolean {
    return this.coordinate.x + Pipe.pipeSize.width < 0;
  }

  use(select: 'green' | 'red'): void {
    this.img = this.pipeImg[select as keyof typeof this.pipeImg];
  }

  Update(): void {
    this.coordinate.x -= lerp(0, this.canvasSize.width, this.velocity.x);
  }

  Display(context: CanvasRenderingContext2D): void {
    const width = Pipe.pipeSize.width / 2;

    const posX = this.coordinate.x;
    const posY = this.coordinate.y;
    const size = this.hollSize / 2;

    // prettier-ignore
    const topImgDim = rescaleDim({
      width: this.img!.top.width,
      height: this.img!.top.height
    }, { width: width * 2 });

    context.drawImage(this.img!.top, posX - width, -(topImgDim.height - Math.abs(posY - size)), topImgDim.width, topImgDim.height);

    // prettier-ignore
    const botImgDim = rescaleDim({
      width: this.img!.bottom.width,
      height: this.img!.bottom.height
    }, { width: width * 2 });

    context.drawImage(this.img!.bottom, posX - width, posY + size, botImgDim.width, botImgDim.height);
  }
}
