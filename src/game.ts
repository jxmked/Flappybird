import BgModel from './model/background';
import PlatformModel from './model/platform';
import BirdModel from './model/bird';
import CountModel from './model/count';
import Screens from './screen';
import Sfx from './model/sfx';
import PipeGenerator from './model/pipe-generator';
import { SFX_VOLUME } from './constants';
import { lerp } from './utils';

/**
 * Actual Screens
 * */

import Intro from './screens/intro';

export default class Game {
  background: BgModel;
  platform: PlatformModel;
  bird: BirdModel;
  pipeGenerator: PipeGenerator;

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  count: CountModel;

  isPlaying: boolean;

  mainScreen: Screens;

  
  currentScreen: string;

  constructor(canvas: HTMLCanvasElement) {
    this.currentScreen = 'intro';

    this.background = new BgModel();
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d')!;
    this.platform = new PlatformModel();
    this.pipeGenerator = new PipeGenerator();
    this.bird = new BirdModel();
    this.count = new CountModel();
    this.isPlaying = false;
    this.mainScreen = new Screens();
  }

  init(): void {
    this.mainScreen.init();
    this.bird.init();
    this.background.init();
    this.platform.init();
    this.count.init();
    Sfx.init();
    Sfx.volume(SFX_VOLUME);
  }

  Resize({ width, height }: IDimension): void {
    this.background.resize({ width, height });
    this.platform.resize({ width, height });
    this.count.resize({ width, height });
    this.mainScreen.resize({ width, height });
    // Set Platform size first
    BirdModel.platformHeight = this.platform.platformSize.height;
    this.bird.resize({ width, height });

    this.pipeGenerator.resize({
      max: height - this.platform.platformSize.height,
      width: width,
      height: height
    });

    this.canvas.width = width;
    this.canvas.height = height;
  }

  Update(): void {
    if (!this.bird.alive) {
      this.bird.Update();
      return;
    }

    this.background.Update();
    this.platform.Update();
    this.mainScreen.Update();

    /*
    if (!this.isPlaying) {
      this.bird.doWave(
        {
          x: this.bird.coordinate.x,
          y: lerp(0, this.canvas.height, 0.48)
        },
        1,
        6
      );
      return;
    }
    
    this.pipeGenerator.Update()
    
    this.bird.Update();

    if (this.bird.isDead(this.pipeGenerator.pipes)) {
      Sfx.hit(() => {
        this.bird.playDead();
      });
    }  */
  }

  Display(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Remove smoothing effect of an image
    this.context.imageSmoothingEnabled = false;
    this.context.imageSmoothingQuality = 'high';

    this.background.Display(this.context);

    for (const pipe of this.pipeGenerator.pipes) {
      pipe.Display(this.context);
    } 

    this.platform.Display(this.context);
    
    /*
    this.bird.Display(this.context);

    this.count.setNum(this.bird.score);
    this.count.Display(this.context); */
    this.mainScreen.Display(this.context);
  }

  onClick({ x, y }: ICoordinate): void {
    this.bird.flap();
  }

  mouseDown({ x, y }: ICoordinate): void {
    this.mainScreen.screenIntro.mouseDown({ x, y });
  }

  mouseUp({ x, y }: ICoordinate): void {
    this.mainScreen.screenIntro.mouseUp({ x, y });
  }
}
