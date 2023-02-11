import { lerp, randomClamp } from '../utils';
import Pipe from './pipe';

export interface IRange {
  min: number;
  max: number;
}

export interface IPipeGeneratorOption {
  min: number;
  max: number;
  distance: number;
  radius: number;
  width: number;
  height: number;
}

export interface IPipeGeneratorValue {
  position: ICoordinate;
  radius: number;
}

export default class PipeGenerator {
  /**
   * Minimum and Maximum number to generate locate
   */
  private range: IRange;

  /**
   * Expected Pipe Distance.
   * Percentage
   */
  private distance: number;

  /**
   * Holl radius
   */
  private radius: number;

  /**
   * Width of platform
   */
  private width: number;

  /**
   * Height of Canvas
   * */
  private height: number;

  /**
   * Pipe Array
   * */
  public pipes: Pipe[];

  constructor() {
    this.range = { max: 0, min: 0 };
    this.distance = 0;
    this.radius = 0;
    this.width = 0;
    this.height = 0;
    this.pipes = [];
  }

  public resize({ min, max, distance, radius, width, height }: IPipeGeneratorOption): void {
    this.range = { max, min };
    this.distance = lerp(0, width, distance);
    this.radius = radius;
    this.width = width;
    this.height = height;
  }

  /**
   * Will return true if the distance of last pipe is equal or greater than
   * expected distance
   */
  public needPipe(): boolean {
    const pipeLen = this.pipes.length;

    if (pipeLen === 0) {
      return true;
    }

    // Get the last pipe and check if the distance of it is equal or greater than max width
    if (this.distance <= ((this.width - this.pipes[pipeLen - 1].coordinate.x) / this.width) * 100) {
      return true;
    }

    return false;
  }

  /**
   * Would generate pipe with random Y position of mid point
   * and with fixed size
   */
  public generate(): IPipeGeneratorValue {
    const radius = lerp(0, this.height, this.radius);
    return {
      position: {
        x: this.width + Pipe.pipeSize.width,
        y: randomClamp(this.range.min + radius, this.range.max - this.range.min - radius)
      },
      radius: this.radius
    };
  }
}
