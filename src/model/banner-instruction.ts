import { rescaleDim } from '../utils';

import { FadeOut } from '../lib/animation';
import ParentClass from '../abstracts/parent-class';
import SpriteDestructor from '../lib/sprite-destructor';

export interface IImagePositions {
  instructImage: ICoordinate;
  getReadyImage: ICoordinate;
}

export interface IBannerInstructionConst {
  positions: IImagePositions;
  fadeOutDuration: number;
}

const BANNER_INSTRUCTION: IBannerInstructionConst = {
  // Modifiable
  fadeOutDuration: 1, // Sec
  positions: {
    instructImage: {
      x: 0.5,
      y: 0.515
    },
    getReadyImage: {
      x: 0.5,
      y: 0.328
    }
  }
};

export interface ITextureProperties {
  size: number; // Can modify

  // System Variables
  position: ICoordinate;
  image: HTMLImageElement | undefined;
  scaled: IDimension;
}

export default class BannerInstruction extends ParentClass {
  private instructImage: ITextureProperties;
  private getReadyImage: ITextureProperties;
  private opacity: number;
  private fadeOut: FadeOut;
  private isComplete: boolean;
  private doesTap: boolean;

  constructor() {
    super();
    this.instructImage = {
      size: 0.4,
      position: {
        x: 0,
        y: 0
      },
      image: void 0,
      scaled: {
        width: 0,
        height: 0
      }
    };
    this.getReadyImage = {
      size: 0.65,
      position: {
        x: 0,
        y: 0
      },
      image: void 0,
      scaled: {
        width: 0,
        height: 0
      }
    };
    this.fadeOut = new FadeOut({
      transition: 'linear'
    });
    this.opacity = 1;
    this.isComplete = false;
    this.doesTap = false;
  }

  public init(): void {
    this.instructImage.image = SpriteDestructor.asset('banner-instruction');
    this.getReadyImage.image = SpriteDestructor.asset('banner-game-ready');
  }

  public reset(): void {
    this.opacity = 1;
    this.isComplete = false;
    this.doesTap = false;
  }

  public tap() {
    if (this.isComplete) return;
    this.fadeOut.start();
    this.isComplete = true;
    this.doesTap = true;
  }

  public resize({ width, height }: IDimension): void {
    super.resize({ width, height });

    this.instructImage.scaled = rescaleDim(
      {
        width: this.instructImage.image!.width,
        height: this.instructImage.image!.height
      },
      { width: width * this.instructImage.size }
    );

    this.getReadyImage.scaled = rescaleDim(
      {
        width: this.getReadyImage.image!.width,
        height: this.getReadyImage.image!.height
      },
      { width: width * this.getReadyImage.size }
    );

    const instructImagePos = BANNER_INSTRUCTION.positions.instructImage;
    const getReadyImagePos = BANNER_INSTRUCTION.positions.getReadyImage;

    this.instructImage.position.x =
      width * instructImagePos.x - this.instructImage.scaled.width / 2;
    this.instructImage.position.y =
      height * instructImagePos.y - this.instructImage.scaled.height / 2;

    this.getReadyImage.position.x =
      width * getReadyImagePos.x - this.getReadyImage.scaled.width / 2;
    this.getReadyImage.position.y =
      height * getReadyImagePos.y - this.getReadyImage.scaled.height / 2;
  }

  public Update(): void {
    if (!this.doesTap) {
      this.opacity = 1;
      return;
    }
    this.opacity = this.fadeOut.value;
  }

  public Display(context: CanvasRenderingContext2D): void {
    if (this.opacity <= 0) return;

    context.globalAlpha = this.opacity;

    context.drawImage(
      this.getReadyImage.image!,
      this.getReadyImage.position.x,
      this.getReadyImage.position.y,
      this.getReadyImage.scaled.width,
      this.getReadyImage.scaled.height
    );

    context.drawImage(
      this.instructImage.image!,
      this.instructImage.position.x,
      this.instructImage.position.y,
      this.instructImage.scaled.width,
      this.instructImage.scaled.height
    );

    context.globalAlpha = 1;
  }
}
