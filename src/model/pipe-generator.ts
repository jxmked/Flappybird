import { PIPE_DISTANCE, PIPE_MIN_GAP } from '../constants';
import { randomClamp } from '../utils';
import Pipe from './pipe';
import SceneGenerator from './scene-generator';
import { IPipeColor } from './pipe';
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

  private pipeColor: IPipeColor;

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
    this.pipeColor = 'green';
  }

  public reset(): void {
    this.pipes.splice(0, this.pipes.length);
    this.resize({
      max: this.range.max,
      width: this.canvasSize.width,
      height: this.canvasSize.height
    });
    this.pipeColor = SceneGenerator.pipe;
  }

  public resize({ max, width, height }: IPipeGeneratorOption): void {
    this.range = { max, min: height * PIPE_MIN_GAP };
    this.distance = width * PIPE_DISTANCE;
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

      pipe.init();
      pipe.use(this.pipeColor);

      pipe.resize(this.canvasSize);

      pipe.setHollPosition(this.generate().position);
      this.pipes.push(pipe);
    }

    for (let index = 0; index < this.pipes.length; index++) {
      this.pipes[index].Update();
      if (this.pipes[index].isOut()) {
        this.pipes.splice(index, 1);
        index--;
      }
    }
  }
}
