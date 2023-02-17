import BgModel from './model/background';
import PlatformModel from './model/platform';
import BirdModel from './model/bird';
import Sfx from './model/sfx';
import PipeGenerator from './model/pipe-generator';
import { SFX_VOLUME } from './constants';

import ParentClass from './abstracts/parent-class';
import { flipRange } from './utils';
import { FadeOut } from './lib/animation';

import Intro from './screens/intro';
import GamePlay from './screens/gameplay';

export default class Game extends ParentClass {
  background: BgModel;
  platform: PlatformModel;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  pipeGenerator: PipeGenerator;

  state: string;
  screenIntro: Intro;
  gamePlay: GamePlay;

  fadeOut: FadeOut;

  isTransitioning: boolean;
  transitionState: string;

  opacity: number;

  doesFadeOut: boolean;

  constructor(canvas: HTMLCanvasElement) {
    super();

    this.background = new BgModel();
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d')!;
    this.platform = new PlatformModel();
    this.pipeGenerator = new PipeGenerator();
    this.screenIntro = new Intro();
    this.gamePlay = new GamePlay(this);

    this.opacity = 1;

    this.fadeOut = new FadeOut({
      duration: 500
    });
    this.doesFadeOut = false;

    this.state = 'intro';
    this.transitionState = 'none';
    this.isTransitioning = false;
  }

  init(): void {
    this.background.init();
    this.platform.init();

    Sfx.init();
    Sfx.volume(SFX_VOLUME);

    this.screenIntro.init();
    this.gamePlay.init();
    this.setEvent();

    this.screenIntro.playButton.active = true;
    this.screenIntro.rankingButton.active = true;
    this.screenIntro.rateButton.active = true;
  }

  Resize({ width, height }: IDimension): void {
    super.resize({ width, height });
    this.background.resize(this.canvasSize);
    this.platform.resize(this.canvasSize);

    BirdModel.platformHeight = this.platform.platformSize.height;

    this.pipeGenerator.resize({
      max: height - this.platform.platformSize.height,
      width: width,
      height: height
    });

    this.screenIntro.resize(this.canvasSize);
    this.gamePlay.resize(this.canvasSize);
    this.canvas.width = width;
    this.canvas.height = height;
  }

  Update(): void {
    this.background.Update();
    this.platform.Update();

    if (this.doesFadeOut && this.fadeOut.status.complete) {
      this.state = 'game';
    }

    if (this.isTransitioning && this.doesFadeOut) {
      this.opacity = this.fadeOut.value;
    }

    switch (this.state) {
      case 'intro':
        this.screenIntro.Update();
        break;

      case 'game':
        this.gamePlay.Update();
        break;
    }

    this.screenIntro.Update();
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

    switch (this.state) {
      case 'intro':
        this.screenIntro.Display(this.context);
        break;

      case 'game':
        this.gamePlay.Display(this.context);
        break;
    }

    this.context.globalAlpha = flipRange(0, 1, this.opacity);

    if (this.isTransitioning) {
      this.context.fillStyle = 'black';
      this.context.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height);
      this.context.fill();
    }

    this.context.globalAlpha = 1;
  }

  setEvent(): void {
    this.screenIntro.playButton.onClick(() => {
      this.isTransitioning = true;

      // Deactivate buttons
      this.screenIntro.playButton.active = false;
      this.screenIntro.rankingButton.active = false;
      this.screenIntro.rateButton.active = false;

      this.fadeOut.start();
      this.isTransitioning = true;
      this.doesFadeOut = true;
    });
  }

  onClick({ x, y }: ICoordinate): void {
    if (this.state === 'game') {
      this.gamePlay.click({ x, y });
    }
  }

  mouseDown({ x, y }: ICoordinate): void {
    this.screenIntro.mouseDown({ x, y });
  }

  mouseUp({ x, y }: ICoordinate): void {
    this.screenIntro.mouseUp({ x, y });
  }
}
