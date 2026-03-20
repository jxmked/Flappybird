import ParentObject from './abstracts/parent-class';
import PlayButton from './model/btn-play';
import RankingButton from './model/btn-ranking';
import RateButton from './model/btn-rate';
import ToggleFPSBtn from './model/btn-toggle-fps';
import ToggleLockFPSBtn from './model/btn-toggle-lock-fps';
import ToggleSpeakerBtn from './model/btn-toggle-speaker';
import ButtonEventHandler from './abstracts/button-event-handler';

export default class Buttons extends ParentObject {
  public static play: PlayButton = new PlayButton();
  public static ranking: RankingButton = new RankingButton();
  public static rate: RateButton = new RateButton();

  public static toggleSound: ToggleSpeakerBtn = new ToggleSpeakerBtn();
  public static toggleFps: ToggleFPSBtn = new ToggleFPSBtn();
  public static toggleLockFps: ToggleLockFPSBtn = new ToggleLockFPSBtn();

  public static btns: ButtonEventHandler[] = [];

  constructor() {
    super();

    // We can handle all buttons in a loop
    Buttons.btns = [Buttons.play, Buttons.ranking, Buttons.rate, Buttons.toggleSound, Buttons.toggleFps, Buttons.toggleLockFps];
  }

  public init(): void {
    for (const btn of Buttons.btns) {
      btn.init();
    }
  }

  public resize({ width, height }: IDimension): void {
    for (const btn of Buttons.btns) {
      btn.resize({ width, height });
    }
  }

  public Update(): void {
    for (const btn of Buttons.btns) {
      btn.Update();
    }
  }

  public Display(context: CanvasRenderingContext2D): void {
    for (const btn of Buttons.btns) {
      btn.Display(context);
    }
  }
}
