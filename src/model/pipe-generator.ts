import { lerp, randomClamp } from '../utils';
import Pipe from './pipe';
import { PIPE_DISTANCE, PIPE_MIN_GAP } from '../constants';

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

  constructor() {
    this.range = { max: 0, min: 0 };
    this.width = 0;
    this.pipes = [];
    this.distance = 0;
  }

  public resize({ max, width, height }: IPipeGeneratorOption): void {
    this.range = { max, min: lerp(0, height, PIPE_MIN_GAP) };
    this.distance = lerp(0, width, PIPE_DISTANCE);
    this.width = width;
  }

  /**
   * Will return true if the distance of last pipe is equal or greater than
   * expected distance from max width
   */
  public needPipe(): boolean {
    const pipeLen = this.pipes.length;

    if (pipeLen === 0) {
      return true;
    }

    // Get the last pipe and check if the distance of it is equal or greater than max width
    if (this.distance <= this.width - this.pipes[pipeLen - 1].coordinate.x) {
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
        x: this.width + Pipe.pipeSize.width,
        y: randomClamp(this.range.min, this.range.max - this.range.min)
      }
    };
  }
}
