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
import { COUNT_DIMENSION, COUNT_COORDINATE } from '../constants';

export type INumberString = Record<string, HTMLImageElement>;

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
    this.setInitAsset(0, n0 as string);
    this.setInitAsset(1, n1 as string);
    this.setInitAsset(2, n2 as string);
    this.setInitAsset(3, n3 as string);
    this.setInitAsset(4, n4 as string);
    this.setInitAsset(5, n5 as string);
    this.setInitAsset(6, n6 as string);
    this.setInitAsset(7, n7 as string);
    this.setInitAsset(8, n8 as string);
    this.setInitAsset(9, n9 as string);
  }

  private setInitAsset(num: number, loc: string): void {
    this.numberAsset[String(num)] = asset(loc) as HTMLImageElement;
  }

  setNum(value: number): void {
    this.currentValue = value;
  }

  resize({ width, height }: IDimension): void {
    super.resize({ width, height });
    this.numberDimension = rescaleDim(COUNT_DIMENSION, {
      height: lerp(0, height, 0.065)
    });

    this.coordinate.x = lerp(0, this.canvasSize.width, COUNT_COORDINATE.x);
    this.coordinate.y = lerp(0, this.canvasSize.height, COUNT_COORDINATE.y);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  Update(): void {}

  Display(context: CanvasRenderingContext2D): void {
    const numArr: string[] = String(this.currentValue).split('');
    const totalWidth = numArr.length * this.numberDimension.width;
    let lastWidth: number = this.coordinate.x - totalWidth / 2;
    const topPos = this.coordinate.y - this.numberDimension.height / 2;

    numArr.forEach((numString: string) => {
      context.drawImage(
        this.numberAsset[numString],
        lastWidth,
        topPos,
        this.numberDimension.width,
        this.numberDimension.height
      );

      lastWidth += this.numberDimension.width;
    });
  }
}
