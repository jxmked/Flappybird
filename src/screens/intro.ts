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
import PlayButton from '../model/btn-play';
import RankingButton from '../model/btn-ranking';
import RateButton from '../model/btn-rate';
import ToggleSpeaker from '../model/btn-toggle-speaker';
import SpriteDestructor from '../lib/sprite-destructor';
import { APP_VERSION } from '../constants';

export default class Introduction extends ParentClass implements IScreenChangerObject {
  public playButton: PlayButton;
  public rankingButton: RankingButton;
  public rateButton: RateButton;
  public toggleSpeakerButton: ToggleSpeaker;

  private bird: BirdModel;
  private flappyBirdBanner: HTMLImageElement | undefined;
  private copyright: HTMLImageElement | undefined;

  constructor() {
    super();
    this.bird = new BirdModel();
    this.playButton = new PlayButton();
    this.rankingButton = new RankingButton();
    this.rateButton = new RateButton();
    this.toggleSpeakerButton = new ToggleSpeaker();
    this.flappyBirdBanner = void 0;
    this.copyright = void 0;
  }

  public init(): void {
    this.bird.init();
    this.playButton.init();
    this.rankingButton.init();
    this.rateButton.init();
    this.toggleSpeakerButton.init();
    this.flappyBirdBanner = SpriteDestructor.asset('banner-flappybird');
    this.copyright = SpriteDestructor.asset('copyright');
  }

  public resize({ width, height }: IDimension): void {
    super.resize({ width, height });
    this.bird.resize({ width, height });
    this.playButton.resize({ width, height });
    this.rankingButton.resize({ width, height });
    this.rateButton.resize({ width, height });
    this.toggleSpeakerButton.resize({ width, height });
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

    this.playButton.Update();
    this.rankingButton.Update();
    this.rateButton.Update();
    this.toggleSpeakerButton.Update();
  }

  public Display(context: CanvasRenderingContext2D): void {
    this.toggleSpeakerButton.Display(context);
    this.playButton.Display(context);
    this.rankingButton.Display(context);
    this.rateButton.Display(context);
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
    context.fillText(`v${APP_VERSION}`, right - 2 * fSize, bot);

    // context.strokeStyle = 'black';
    // context.strokeText(`v${APP_VERSION}`, right - 2 * fSize, bot);
  }

  public mouseDown({ x, y }: ICoordinate): void {
    this.toggleSpeakerButton.mouseEvent('down', { x, y });
    this.playButton.mouseEvent('down', { x, y });
    this.rankingButton.mouseEvent('down', { x, y });
    this.rateButton.mouseEvent('down', { x, y });
  }

  public mouseUp({ x, y }: ICoordinate): void {
    this.toggleSpeakerButton.mouseEvent('up', { x, y });
    this.playButton.mouseEvent('up', { x, y });
    this.rankingButton.mouseEvent('up', { x, y });
    this.rateButton.mouseEvent('up', { x, y });
  }

  public startAtKeyBoardEvent(): void {
    this.playButton.click();
  }
}
