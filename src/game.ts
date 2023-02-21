import BgModel from './model/background';
import BirdModel from './model/bird';
import { FadeOutIn } from './lib/animation';
import GamePlay from './screens/gameplay';
import Intro from './screens/intro';
import ParentClass from './abstracts/parent-class';
import PipeGenerator from './model/pipe-generator';
import PlatformModel from './model/platform';
import { SFX_VOLUME } from './constants';
import ScreenChanger from './lib/screen-changer';
import Sfx from './model/sfx';
import { flipRange } from './utils';

export default class Game extends ParentClass {
  background: BgModel;
  platform: PlatformModel;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  pipeGenerator: PipeGenerator;
  screenIntro: Intro;
  gamePlay: GamePlay;
  state: string;
  isTransitioning: boolean;
  opacity: number;
  bgPause: boolean;
  screenChanger: ScreenChanger;
  transition: FadeOutIn;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.screenChanger = new ScreenChanger();
    this.background = new BgModel();
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d')!;
    this.platform = new PlatformModel();
    this.pipeGenerator = new PipeGenerator();
    this.screenIntro = new Intro();
    this.gamePlay = new GamePlay(this);
    this.state = 'intro';
    this.bgPause = false;
    this.opacity = 1;
    this.isTransitioning = false;
    this.transition = new FadeOutIn({ duration: 500 });
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

    // Register screens
    this.screenChanger.register('intro', this.screenIntro);
    this.screenChanger.register('game', this.gamePlay);
  }

  reset(): void {
    this.background.reset();
    this.platform.reset();
    this.Resize(this.canvasSize);
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
    this.screenChanger.setState(this.state);

    if (this.isTransitioning) {
      this.opacity = this.transition.value;
      if (this.opacity <= 0.001) {
        this.state = 'game';
      }
    }

    if (!this.bgPause) {
      this.background.Update();
      this.platform.Update();
    }

    this.screenChanger.Update();
  }

  Display(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Remove smoothing effect of an image
    this.context.imageSmoothingEnabled = false;
    this.context.imageSmoothingQuality = 'high';

    this.screenChanger.setState(this.state);
    this.background.Display(this.context);

    for (const pipe of this.pipeGenerator.pipes) {
      pipe.Display(this.context);
    }

    this.platform.Display(this.context);
    this.screenChanger.Display(this.context);

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
      if (this.state !== 'intro') return;
      this.isTransitioning = true;

      // Deactivate buttons
      this.screenIntro.playButton.active = false;
      this.screenIntro.rankingButton.active = false;
      this.screenIntro.rateButton.active = false;

      this.transition.start();
      this.isTransitioning = true;
    });
  }

  onClick({ x, y }: ICoordinate): void {
    if (this.state === 'game') {
      this.gamePlay.click({ x, y });
    }
  }

  mouseDown({ x, y }: ICoordinate): void {
    this.screenIntro.mouseDown({ x, y });
    this.gamePlay.mouseDown({ x, y });
  }

  mouseUp({ x, y }: ICoordinate): void {
    this.screenIntro.mouseUp({ x, y });
    this.gamePlay.mouseUp({ x, y });
  }
}
