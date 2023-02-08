import { asset, lerp, rescaleDim} from '../utils';
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

export interface IBirdObject {
  up: HTMLImageElement;
  mid: HTMLImageElement;
  down: HTMLImageElement;
}

export type IBirdColors = 'yellow' | 'red' | 'blue';

export interface IProps {
  gravity:number;
  jump: number;
  position:ICoordinate;
  width:number;
  height: number;
  flapState: number; // Array(Up, Mid, Down)
}


export default class Bird {
  birdColorObject: { [key: string]: IBirdObject };
  color: IBirdColors;
  birdImg: undefined | IBirdObject;
  props: IProps;
  canvasSize:IDimension;
  
  constructor() {
    this.birdColorObject = {};
    this.color = 'yellow';
    this.birdImg = void 0;
    this.props = {
      gravity: 0,
      jump: -6,
      position: {
        x: 0,
        y: 0
      },
      width: 50,// Define the width and the image automatically scale up to that
      height: 0,
      flapState: 0
    }
    this.canvasSize = {
      width: 0,
      height: 0
    }
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
  
  resize({width, height}:IDimension): void {
    this.canvasSize = {width, height};
    this.props.width = lerp(0, width, 0.1)
  }
  
  flap(): void {
    Sfx.wing();
  }

  isDead(): boolean {
    return false;
  }

  playDead(): void {
    Sfx.die();
  }

  use(color: IBirdColors): void {
    this.birdImg = this.birdColorObject[color as keyof typeof this.birdColorObject];
  }

  Update(): void {}

  Display(context: CanvasRenderingContext2D): void {
    const flapArr = ["up", "mid", "down"] as keyof typeof this.birdImg;
    
    const { x, y } = this.props.position;
    const { width, gravity, flapState } = this.props;
    const img:HTMLImageElement = this.birdImg![flapArr[flapState]]
    const resized = rescaleDim(
      {
        width: img.width,
        height: img.height
      },
      { width }
    );

    
    context.beginPath();
    context.arc(x, y, 10, 0, Math.PI * 2);
    context.fillStyle = "blue";
    context.fill();
    context.closePath();


    context.save();
    context.translate(x, y);
    context.translate(resized.width / 2, resized.height / 2);
    
    // Rotate Based On Gravity
    context.rotate(((Math.PI / 2) * gravity) / 20);
    
    
    context.drawImage(img, -resized.width / 2, -resized.height / 2)//, resized.width, resized.height);

    context.restore();
    
    
  }
}
