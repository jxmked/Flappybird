/**
 * Display "FlappyBird"
 * Display the bird close to the middle and at the center
 *
 * Display "Play", "Rate" buttons and maybe include the
 * "Ranking" button but with no function. Just to mimic the
 * original game since ranking only works if the game is
 * connected to Google Play Games or Apple Game Center
 * */

import { rescaleDim } from '../utils';

import BirdModel from '../model/bird';
import { IScreenChangerObject } from '../lib/screen-changer';
import ParentClass from '../abstracts/parent-class';
import SpriteDestructor from '../lib/sprite-destructor';
import { ENV } from '../constants';
import ButtonsHandler from '../buttons';

export default class Introduction extends ParentClass implements IScreenChangerObject {
  public btnHandler: ButtonsHandler;

  private bird: BirdModel;
  private flappyBirdBanner: HTMLImageElement | undefined;
  private copyright: HTMLImageElement | undefined;

  constructor() {
    super();
    this.bird = new BirdModel();
    this.flappyBirdBanner = void 0;
    this.copyright = void 0;
    this.btnHandler = new ButtonsHandler();
  }

  public init(): void {
    this.bird.init();

    this.btnHandler.init();

    for (const btn of ButtonsHandler.btns) {
      btn.active = true;
    }

    this.flappyBirdBanner = SpriteDestructor.asset('banner-flappybird');
    this.copyright = SpriteDestructor.asset('copyright');
  }

  public resize(screen_dimension: IDimension): void {
    super.resize(screen_dimension);
    this.bird.resize(screen_dimension);

    this.btnHandler.resize(screen_dimension);
  }

  public Update(): void {
    this.bird.doWave(
      {
        x: this.canvasSize.width * 0.5,
        y: this.canvasSize.height * 0.4
      },
      1.4,
      9
    );

    this.btnHandler.Update();
  }

  public Display(context: CanvasRenderingContext2D): void {
    this.btnHandler.Display(context);

    this.bird.Display(context);

    // Flappy Bird Banner
    const fbbScaled = rescaleDim(
      {
        width: this.flappyBirdBanner!.width,
        height: this.flappyBirdBanner!.height
      },
      { width: this.canvasSize.width * 0.67 }
    );

    context.drawImage(
      this.flappyBirdBanner!,
      this.canvasSize.width * 0.5 - fbbScaled.width / 2,
      this.canvasSize.height * 0.28 - fbbScaled.height / 2,
      fbbScaled.width,
      fbbScaled.height
    );
    // ----------------------------------

    // Copyright
    const crScaled = rescaleDim(
      {
        width: this.copyright!.width,
        height: this.copyright!.height
      },
      { width: this.canvasSize.width * 0.44 }
    );

    context.drawImage(
      this.copyright!,
      this.canvasSize.width * 0.5 - crScaled.width / 2,
      this.canvasSize.height * 0.806 - crScaled.height / 2,
      crScaled.width,
      crScaled.height
    );
    // ----------------------------------

    this.insertAppVersion(context);
  }

  private insertAppVersion(context: CanvasRenderingContext2D): void {
    const fSize = this.canvasSize.width * 0.04;
    const bot = this.canvasSize.height * 0.985;
    const right = this.canvasSize.width * 0.985;

    context.font = `bold ${fSize}px monospace`;
    context.textAlign = 'center';
    context.fillStyle = '#8E8E93';
    context.fillText(`v${ENV.APP_VERSION}`, right - 2 * fSize, bot);
  }

  public mouseDown(coor: ICoordinate): void {
    for (const btn of ButtonsHandler.btns) {
      btn.mouseEvent('down', coor);
    }
  }

  public mouseUp(coor: ICoordinate): void {
    for (const btn of ButtonsHandler.btns) {
      btn.mouseEvent('up', coor);
    }
  }

  public startAtKeyBoardEvent(): void {
    ButtonsHandler.play.click();
  }
}
