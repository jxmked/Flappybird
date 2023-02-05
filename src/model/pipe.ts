import { asset } from '../utils';
import pipeTopGreen from '../assets/sprites/pipe/top-green.png';
import pipeBottomRed from '../assets/sprites/pipe/bottom-red.png';
import pipeBottomGreen from '../assets/sprites/pipe/bottom-green.png';
import pipeTopRed from '../assets/sprites/pipe/top-red.png';
import { rescaleDim, IRescaleDim, lerp } from '../utils';

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
  coordinate: ICoordinate;
  canvasSize: IDimension;
  pipeSize: IDimension;
  pipeImg: { [key: string]: IPairPipe };
  img: undefined | IPairPipe;
  hollPositiion: number;
  hollSize: number;
  pipePosition: IPipePairPosition;

  constructor() {
    // Percentage
    this.velocity = { x: 0.0002, y: 0 };
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
    this.hollPositiion = 0;
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
    // Update Pipe Size
    const min = lerp(0, Math.min(this.canvasSize.height, this.canvasSize.width), 0.2);
    this.pipeSize = rescaleDim(this.pipeSize, { width: min });
    
    // Positioning holl
    this.hollSize = lerp(0, this.canvasSize.height, hollSize);
    this.hollPositiion = position;
    this.pipePosition.top.y = Math.abs(position - (this.hollSize / 2));
    this.pipePosition.bottom.y = Math.abs(position - this.hollSize);
    
    console.log(this.pipePosition)
  }

  resize({ width, height }: IDimension): void {
    this.canvasSize.width = width;
    this.canvasSize.height = height;
  }

  use(select: 'green' | 'red'): void {
    this.img = this.pipeImg[select as keyof typeof this.pipeImg];
  }

  Update(): void {}

  Display(context: CanvasRenderingContext2D): void {
    const { x, y } = this.coordinate;
    const { width, height } = this.pipeSize;

   /* context.beginPath();
    context.arc(x, this.pipePosition.top.y, 10, 0, Math.PI * 2);
    context.fillStyle = 'black';
    context.fill();
    context.closePath();
    context.beginPath()
    context.arc(x, this.pipePosition.bottom.y, 10, 0, Math.PI * 2);
    context.fillStyle = 'red';
    context.fill();
    context.closePath(); */
    // prettier-ignore
      const resizedA= rescaleDim({ 
        width: this.img!.top.width,
        height: this.img!.top.height
      }, { width });
      
      context.drawImage(this.img!.top, this.pipePosition.top.x, (this.pipePosition.top.y - resizedA.height), resizedA.width, resizedA.height);

      // prettier-ignore
      const resizedB = rescaleDim({ 
        width: this.img!.bottom.width,
        height: this.img!.bottom.height
      }, { width });

      context.drawImage(this.img!.bottom, this.pipePosition.bottom.x, this.pipePosition.bottom.y, resizedB.width, resizedB.height);
    
  }
}
