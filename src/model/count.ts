import ParentClass from '../abstracts/parent-class';

import n9 from '../assets/sprites/number/9.png';
import n8 from '../assets/sprites/number/8.png';
import n7 from '../assets/sprites/number/7.png';
import n6 from '../assets/sprites/number/6.png';
import n5 from '../assets/sprites/number/5.png';
import n4 from '../assets/sprites/number/4.png';
import n3 from '../assets/sprites/number/3.png';
import n2 from '../assets/sprites/number/2.png';
import n1 from '../assets/sprites/number/1.png';
import n0 from '../assets/sprites/number/0.png';

import { asset, lerp, rescaleDim } from '../utils';

export interface ICountOptions {
  coordinate: ICoordinate;
}

export type INumberString = { [key: string]: HTMLImageElement };

const COUNT_DIMENSION: IDimension = {
  width: 24,
  height: 36
};
const COUNT_COORDINATE: ICoordinate = {
  x: 0.5,
  y: 0.15
};

export default class Count extends ParentClass {
 
  currentValue: number;
  numberAsset: INumberString;
  numberDimension: IDimension;

  constructor() {
    super();

    this.currentValue = 0;
    this.numberAsset = {};
    this.numberDimension = {
      width: 0,
      height: 0
    };
  }

  init(): void {
    this.setInitAsset(0, n0);
    this.setInitAsset(1, n1);
    this.setInitAsset(2, n2);
    this.setInitAsset(3, n3);
    this.setInitAsset(4, n4);
    this.setInitAsset(5, n5);
    this.setInitAsset(6, n6);
    this.setInitAsset(7, n7);
    this.setInitAsset(8, n8);
    this.setInitAsset(9, n9);
  }

  private setInitAsset(num: number, loc: string): void {
    this.numberAsset[num as keyof typeof this.numberAsset] = asset(
      loc
    ) as HTMLImageElement;
  }

  setNum(value: number): void {
    this.currentValue = value;
  }

  resize({ width, height }: IDimension): void {
    super.resize({ width, height });
    this.numberDimension = rescaleDim(COUNT_DIMENSION, {
      width: lerp(0, width, 0.05)
    });

    this.coordinate.x = lerp(0, this.canvasSize.width, COUNT_COORDINATE.x);
    this.coordinate.y = lerp(0, this.canvasSize.height, COUNT_COORDINATE.y);
  }

  Update(): void {}

  Display(context: CanvasRenderingContext2D): void {}

  private drawImage(ctx, value: number): void {}
}
