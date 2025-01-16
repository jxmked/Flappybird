import BgModel from './model/background';
import BirdModel from './model/bird';
import GamePlay from './screens/gameplay';
import Intro from './screens/intro';
import ParentClass from './abstracts/parent-class';
import PipeGenerator from './model/pipe-generator';
import PlatformModel from './model/platform';
import { SFX_VOLUME } from './constants';
import ScreenChanger from './lib/screen-changer';
import Sfx from './model/sfx';
import Storage from './lib/storage';
import FlashScreen from './model/flash-screen';

export type IGameState = 'intro' | 'game';

export default class Game extends ParentClass {
  public background: BgModel;
  public platform: PlatformModel;
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public pipeGenerator: PipeGenerator;
  public bgPause: boolean;
  private screenChanger: ScreenChanger;
  private transition: FlashScreen;
  private screenIntro: Intro;
  private gamePlay: GamePlay;
  private state: IGameState;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.screenChanger = new ScreenChanger();
    this.background = new BgModel();
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d', {
      desynchronized: true,
      alpha: false
    })!;
    this.platform = new PlatformModel();
    this.pipeGenerator = new PipeGenerator();
    this.screenIntro = new Intro();
    this.gamePlay = new GamePlay(this);
    this.state = 'intro';
    this.bgPause = false;
    this.transition = new FlashScreen({
      interval: 700,
      strong: 1,
      style: 'black',
      easing: 'sineWaveHS'
    });

    this.transition.setEvent([0.98, 1], () => {
      this.state = 'game';
    });
  }

  public init(): void {
    new Storage(); // Init first
    this.background.init();
    this.platform.init();
    this.transition.init();

    void Sfx.init();
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

  public reset(): void {
    this.background.reset();
    this.platform.reset();
    this.Resize(this.canvasSize);
  }

  public Resize({ width, height }: IDimension): void {
    super.resize({ width, height });
    this.background.resize(this.canvasSize);
    this.platform.resize(this.canvasSize);
    this.transition.resize(this.canvasSize);
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

  public Update(): void {
    this.transition.Update();
    this.screenChanger.setState(this.state);

    if (!this.bgPause) {
      this.background.Update();
      this.platform.Update();
    }

    this.screenChanger.Update();
  }

  public Display(): void {
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
    this.transition.Display(this.context);
  }

  public setEvent(): void {
    this.screenIntro.playButton.onClick(() => {
      if (this.state !== 'intro') return;

      // Deactivate buttons
      this.screenIntro.playButton.active = false;
      this.screenIntro.rankingButton.active = false;
      this.screenIntro.rateButton.active = false;
      this.screenIntro.toggleSpeakerButton.active = false;

      this.transition.reset();
      this.transition.start();
    });
  }

  public onClick({ x, y }: ICoordinate): void {
    if (this.state === 'game') {
      this.gamePlay.click({ x, y });
    }
  }

  public mouseDown({ x, y }: ICoordinate): void {
    this.screenIntro.mouseDown({ x, y });
    this.gamePlay.mouseDown({ x, y });
  }

  public mouseUp({ x, y }: ICoordinate): void {
    this.screenIntro.mouseUp({ x, y });
    this.gamePlay.mouseUp({ x, y });
  }

  public startAtKeyBoardEvent(): void {
    if (this.state === 'intro') this.screenIntro.startAtKeyBoardEvent();
    else this.gamePlay.startAtKeyBoardEvent();
  }

  public get currentState(): IGameState {
    return this.state;
  }
}
