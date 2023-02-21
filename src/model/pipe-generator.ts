import { PIPE_DISTANCE, PIPE_MIN_GAP } from '../constants';
import { lerp, randomClamp } from '../utils';

import Pipe from './pipe';

export interface IRange {
  min: number;
  max: number;
}

export interface IPipeGeneratorOption {
  max: number;
  width: number;
  height: number;
}

export interface IPipeGeneratorValue {
  position: ICoordinate;
}

export default class PipeGenerator {
  /**
   * Minimum and Maximum number to generate locate
   */
  private range: IRange;

  /**
   * Width of platform
   */
  private width: number;

  /**
   * Pipe Array
   * */
  public pipes: Pipe[];

  /**
   * Expected Distance between Pipes
   * */
  private distance: number;

  /**
   * Initial X position of new pipe
   * */
  private initialXPos: number;

  /**
   * Canvas Size
   * */
  private canvasSize: IDimension;

  constructor() {
    this.range = { max: 0, min: 0 };
    this.width = 0;
    this.pipes = [];
    this.distance = 0;
    this.initialXPos = 0;
    this.canvasSize = {
      width: 0,
      height: 0
    };
  }

  public reset(): void {
    this.pipes.splice(0, this.pipes.length);
    this.resize({
      max: this.range.max,
      width: this.canvasSize.width,
      height: this.canvasSize.height
    });
  }

  public resize({ max, width, height }: IPipeGeneratorOption): void {
    this.range = { max, min: lerp(0, height, PIPE_MIN_GAP) };
    this.distance = lerp(0, width, PIPE_DISTANCE);
    this.width = width;
    this.canvasSize = { width, height };

    for (const pipe of this.pipes) {
      pipe.resize(this.canvasSize);
    }
  }

  /**
   * Will return true if the distance of last pipe is equal or greater than
   * expected distance from max width
   */
  public needPipe(): boolean {
    const pipeLen = this.pipes.length;

    if (pipeLen === 0) {
      this.initialXPos = (this.width + Pipe.pipeSize.width) * 2;
      return true;
    }

    // Get the last pipe and check if the distance of it is equal or greater than max width
    if (this.distance <= this.width - this.pipes[pipeLen - 1].coordinate.x) {
      this.initialXPos = this.width + Pipe.pipeSize.width;
      return true;
    }

    return false;
  }

  /**
   * Would generate pipe with random Y position of mid point
   * and with fixed size
   */
  public generate(): IPipeGeneratorValue {
    return {
      position: {
        x: this.initialXPos,
        y: randomClamp(this.range.min, this.range.max - this.range.min)
      }
    };
  }

  public Update(): void {
    if (this.needPipe()) {
      const pipe = new Pipe();

      pipe.resize(this.canvasSize);

      pipe.setHollPosition(this.generate().position);

      pipe.init();

      this.pipes.push(pipe);
    }

    for (let index = 0; index < this.pipes.length; index++) {
      this.pipes[index].Update();
      if (this.pipes[index].isOut()) {
        this.pipes.splice(index, 1);
      }
    }
  }
}
