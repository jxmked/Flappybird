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
  pipeSize: IDimension;
  pipeImg: { [key: string]: IPairPipe };
  img: undefined | IPairPipe;
  hollSize: number;
  pipePosition: IPipePairPosition;

  constructor() {
    // Percentage
    this.velocity = { x: 0.002, y: 0 };
    this.coordinate = { x: 0, y: 0 };
    this.canvasSize = {
      width: 0,
      height: 0
    };
    this.pipeImg = {};

    this.hollSize = 0;
    this.pipeSize = {
      width: 120,
      height: 300
    };

    this.img = void 0;
    this.pipePosition = {
      top: { x: 0, y: 0 },
      bottom: { x: 0, y: 0 }
    };
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

  setHollPosition(position: number, hollSize: number): void {
    // Positioning holl
    this.hollSize = lerp(0, this.canvasSize.height, hollSize);
    this.coordinate.y = position;
    this.pipePosition.top.y = this.coordinate.y;
    this.pipePosition.bottom.y = this.coordinate.y + this.hollSize;
    this.pipePosition.bottom.x = this.coordinate.x;
    this.pipePosition.top.x = this.coordinate.x;
    this.coordinate.x = this.canvasSize.width;
  }

  resize({ width, height }: IDimension): void {
    this.canvasSize.width = width;
    this.canvasSize.height = height;

    // Update Pipe Size
    const min = lerp(0, Math.min(this.canvasSize.height, this.canvasSize.width), 0.18);
    this.pipeSize = rescaleDim(this.pipeSize, { width: min });
  }

  isOut(): boolean {
    return this.coordinate.x < 0;
  }

  use(select: 'green' | 'red'): void {
    this.img = this.pipeImg[select as keyof typeof this.pipeImg];
  }

  Update(): void {
    this.coordinate.x -= lerp(0, this.canvasSize.width, this.velocity.x);
    this.pipePosition.bottom.x = this.coordinate.x;
    this.pipePosition.top.x = this.coordinate.x;
  }

  Display(context: CanvasRenderingContext2D): void {
    const { width } = this.pipeSize;

    // prettier-ignore
    const resizedA = rescaleDim({
      width: this.img!.top.width,
      height: this.img!.top.height
    }, { width });

    context.drawImage(this.img!.top, this.pipePosition.top.x, this.pipePosition.top.y - resizedA.height, resizedA.width, resizedA.height);

    // prettier-ignore
    const resizedB = rescaleDim({
      width: this.img!.bottom.width,
      height: this.img!.bottom.height
    }, { width });

    console.log(this.pipePosition.bottom);
    context.drawImage(this.img!.bottom, this.pipePosition.bottom.x, this.pipePosition.bottom.y - 100, resizedB.width, resizedB.height);
  }
}
