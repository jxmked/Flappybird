import { FadeOut } from './lib/animation';
import Intro from './screens/intro';
import ParentClass from './abstracts/parent-class';
import { flipRange } from './utils';

export default class Screen extends ParentClass {
  state: string;
  screenIntro: Intro;

  fadeOut: FadeOut;

  isTransitioning: boolean;
  transitionState: string;

  opacity: number;

  doesFadeOut: boolean;

  constructor() {
    super();
    this.state = 'intro';
    this.transitionState = 'none';
    this.isTransitioning = false;
    this.screenIntro = new Intro();
    this.opacity = 1;
    this.fadeOut = new FadeOut({
      duration: 500
    });
    this.doesFadeOut = false;

    // Activate buttons
    this.screenIntro.playButton.active = true;
    this.screenIntro.rankingButton.active = true;
    this.screenIntro.rateButton.active = true;
  }

  setEvent(): void {
    this.screenIntro.playButton.onClick(() => {
      this.isTransitioning = true;

      // Deactivate buttons
      /*  this.screenIntro.playButton.active = false;
      this.screenIntro.rankingButton.active = false;
      this.screenIntro.rateButton.active = false; */

      this.fadeOut.start();
      this.isTransitioning = true;
      this.doesFadeOut = true;
    });
  }

  init(): void {
    this.screenIntro.init();

    this.setEvent();
  }

  resize({ width, height }: IDimension): void {
    super.resize({ width, height });
    this.screenIntro.resize({ width, height });
  }

  Update(): void {
    if (this.doesFadeOut && this.fadeOut.status.complete) {
      this.state = 'game';
    }

    if (this.isTransitioning && this.doesFadeOut) {
      this.opacity = this.fadeOut.value;
    }

    this.screenIntro.Update();
  }

  Display(context: CanvasRenderingContext2D): void {
    this.screenIntro.Display(context);

    context.globalAlpha = flipRange(0, 1, this.opacity);

    if (this.isTransitioning) {
      context.fillStyle = 'black';
      context.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height);
      context.fill();
    }

    context.globalAlpha = 1;
  }
}
