import Parent from '../abstracts/button-event-handler';
import SpriteDestructor from '../lib/sprite-destructor';
import ToggleFPSBtn from './btn-toggle-fps';
import Sfx from './sfx';

export default class ToggleSpeakerBtn extends ToggleFPSBtn implements Parent {
  constructor() {
    super();
    this.initialWidth = 0.1;
    this.coordinate.x = 0.93;
    this.coordinate.y = 0.04;
  }

  public click(): void {
    Sfx.swoosh();

    Sfx.currentVolume = Sfx.currentVolume > 0 ? 0 : 1;

    this.setImg();
  }

  protected setImg(): void {
    const key = `${Sfx.currentVolume > 0 ? 'unmute' : 'mute'}`;
    this.img = this.assets.get(key)!;
  }

  public init(): void {
    this.assets.set('mute', SpriteDestructor.asset('btn-mute'));
    this.assets.set('unmute', SpriteDestructor.asset('btn-speaker'));

    this.setImg();
  }
}
