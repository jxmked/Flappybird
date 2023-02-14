import ParentClass from './abstracts/parent-class';
import { asset } from './lib/sprite-destructor';
import { lerp, rescaleDim, BackNForthCounter } from './utils';
import Sfx from './model/sfx';

/**
 * Banners
 * */
import BInstruction from './model/banner-instruction';

export interface IImageSizes {
  numberIcons: number;
}

export default class Screen extends ParentClass {
  images: Map<string, HTMLImageElement>;
  imageSizes: IImageSizes;

  state: string;

  BInstruction: BInstruction;
  constructor() {
    super();
    this.images = new Map<string, HTMLImageElement>();
    this.imageSizes = {
      numberIcons: 0.002
    };
    this.state = 'waiting';
    this.BInstruction = new BInstruction();
  }

  init(): void {
    [
      'coin-shine-gold',
      'coin-shine-silver',
      'coin-dull-bronze',
      'coin-dull-metal',
      'number-md-0',
      'number-md-1',
      'number-md-2',
      'number-md-3',
      'number-md-4',
      'number-md-5',
      'number-md-6',
      'number-md-7',
      'number-md-8',
      'number-md-9',
      'toast-new',
      'btn-rate',
      'btn-play',
      'spark-sm',
      'spark-md',
      'spark-lg',
      'banner-game-ready',
      'banner-game-over',
      'banner-flappybird'
    ].forEach((value: string) => {
      this.images.set(value, asset(value));
    });
    this.BInstruction.init();
  }

  resize({ width, height }: IDimension): void {
    super.resize({ width, height });
    this.BInstruction.resize({ height, width });
  }

  Update(): void {
    this.BInstruction.Update();
  }

  Display(context: CanvasRenderingContext2D): void {
    this.BInstruction.Display(context);
  }
}
