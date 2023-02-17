/**
 * Lets visualize the event
 *
 * On Mouse Down, this object will check if the mouse position
 * is in side of button coordinate and within dimensions.
 * If do, perform hover like event. On mouse up, this function will check
 * if the mouse release has been perform inside of the button then
 * thats click, other no button click has been performed.
 *
 * On mouse down and the position of the mouse is outside of the button
 * then slide inside of the button before releasing, thats is not
 * a button click.
 *
 * We can only check the mouse down and up.
 * We don't have drag and drop here so its fun
 * */

import { rescaleDim, lerp } from '../utils';

export type IMouseState = 'down' | 'up';

export default abstract class ButtonEventHandler {
  public active: boolean;

  protected coordinate: ICoordinate;
  protected img: HTMLImageElement | undefined;
  protected initialWidth: number; // lerp - %
  protected dimension: IDimension;
  protected calcCoord: ICoordinate;

  protected canvasSize: IDimension;

  // Track where the mouse down triggered
  private touchStart: ICoordinate;
  private hoverState: boolean;
  private additionalTranslate: ICoordinate;

  constructor() {
    this.coordinate = {
      x: 0,
      y: 0
    };
    this.calcCoord = {
      x: 0,
      y: 0
    };
    this.dimension = {
      width: 0,
      height: 0
    };
    this.canvasSize = {
      width: 0,
      height: 0
    };
    this.additionalTranslate = {
      x: 0,
      y: 0
    };
    this.touchStart = {
      x: 0,
      y: 0
    };
    this.active = false;
    this.img = void 0;
    this.hoverState = false;
    this.initialWidth = 0;
  }

  public get isHover(): boolean {
    return this.hoverState;
  }

  public resize({ width, height }: IDimension): void {
    if (this.img !== void 0) {
      this.dimension = rescaleDim(
        {
          width: this.img.width,
          height: this.img.height
        },
        { width: lerp(0, width, this.initialWidth) }
      );
    }

    this.canvasSize = { width, height };
  }

  public Update(): void {
    this.calcCoord.x =
      lerp(0, this.canvasSize.width, this.coordinate.x) + this.additionalTranslate.x;
    this.calcCoord.y =
      lerp(0, this.canvasSize.height, this.coordinate.y) + this.additionalTranslate.y;
  }

  public mouseEvent(state: IMouseState, { x, y }: ICoordinate): void {
    if (state === 'down') {
      this.onMouseDown({ x, y });
    } else if (state === 'up') {
      this.onMouseup({ x, y });
    }
  }

  private isInRange({ x, y }: ICoordinate): boolean {
    const xLoc = this.calcCoord.x;
    const yLoc = this.calcCoord.y;
    const xRad = this.dimension.width / 2;
    const yRad = this.dimension.height / 2;

    // Out of button area from x-axis
    if (!(xLoc - xRad < x && xLoc + xRad > x)) return false;

    // Out of button area from y-axis
    if (!(yLoc - yRad < y && yLoc + yRad > y)) return false;

    return true;
  }

  private onMouseDown(coord: ICoordinate): void {
    if (!this.active) return;

    this.touchStart = coord;

    if (this.isInRange(coord)) {
      this.hoverState = true;
    }
  }

  private onMouseup(coord: ICoordinate): void {
    if (!this.active) return;
    this.hoverState = false;
    console.log(coord);
    console.log(this.touchStart);
    console.log(this.isInRange(coord), this.isInRange(this.touchStart));
    // Only click if mouse down start inside of the button
    // and up inside of the button
    if (this.isInRange(coord) && this.isInRange(this.touchStart)) {
      this.click();
    }
  }

  protected move({ x, y }: ICoordinate): void {
    this.additionalTranslate.x = lerp(0, this.canvasSize.width, x);
    this.additionalTranslate.y = lerp(0, this.canvasSize.height, y);
  }

  public abstract init(): void;
  public abstract click(): void;
  public abstract Display(context: CanvasRenderingContext2D): void;
}
