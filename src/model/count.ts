import { COUNT_COORDINATE, COUNT_DIMENSION } from '../constants';
import { rescaleDim } from '../utils';

import ParentClass from '../abstracts/parent-class';
import SpriteDestructor from '../lib/sprite-destructor';

export type INumberString = Record<string, HTMLImageElement>;

export default class Count extends ParentClass {
  private currentValue: number;
  private numberAsset: INumberString;
  private numberDimension: IDimension;

  constructor() {
    super();

    this.currentValue = 0;
    this.numberAsset = {};
    this.numberDimension = {
      width: 0,
      height: 0
    };
  }

  public init(): void {
    this.setInitAsset(0, 'number-lg-0');
    this.setInitAsset(1, 'number-lg-1');
    this.setInitAsset(2, 'number-lg-2');
    this.setInitAsset(3, 'number-lg-3');
    this.setInitAsset(4, 'number-lg-4');
    this.setInitAsset(5, 'number-lg-5');
    this.setInitAsset(6, 'number-lg-6');
    this.setInitAsset(7, 'number-lg-7');
    this.setInitAsset(8, 'number-lg-8');
    this.setInitAsset(9, 'number-lg-9');
  }

  private setInitAsset(num: number, loc: string): void {
    this.numberAsset[String(num)] = SpriteDestructor.asset(loc);
  }

  public setNum(value: number): void {
    this.currentValue = value;
  }

  public resize({ width, height }: IDimension): void {
    super.resize({ width, height });
    this.numberDimension = rescaleDim(COUNT_DIMENSION, {
      height: height * 0.065
    });

    this.coordinate.x = this.canvasSize.width * COUNT_COORDINATE.x;
    this.coordinate.y = this.canvasSize.height * COUNT_COORDINATE.y;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public Update(): void {}

  public Display(context: CanvasRenderingContext2D): void {
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
