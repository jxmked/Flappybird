import Parent from '../abstracts/button-event-handler';
import SpriteDestructor from '../lib/sprite-destructor';
import Sfx from './sfx';
import DynamicFps from '../lib/dynamic-fps';
import ToggleFPSBtn from './btn-toggle-fps';

export default class ToggleLockFPSBtn extends ToggleFPSBtn implements Parent {
  constructor() {
    super();
    this.initialWidth = 0.098;
    this.coordinate.x = 0.92;
    this.coordinate.y = 0.15;
  }

  public click(): void {
    Sfx.swoosh();

    DynamicFps.IS_LOCK = !DynamicFps.IS_LOCK;

    this.setImg();
  }

  protected setImg(): void {
    const key = `${DynamicFps.IS_LOCK ? 'locked' : 'unlocked'}`;
    this.img = this.assets.get(key)!;
  }

  public init(): void {
    this.assets.set('unlocked', SpriteDestructor.asset('btn-fps-unlocked'));
    this.assets.set('locked', SpriteDestructor.asset('btn-fps-locked'));

    this.setImg();
  }
}
