import PlayButton from './btn-play'; // Instead of duplicating
import SpriteDestructor from '../lib/sprite-destructor';
import { openInNewTab } from '../utils';

/**
 * Instead of creating everything from scratch
 * Let us depend on PlayButton since they have
 * a lot of similarities
 * */
export default class RateNutton extends PlayButton {
  constructor() {
    super();
    this.initialWidth = 0.24;
    this.coordinate.x = 0.5;
    this.coordinate.y = 0.53;
  }

  public init(): void {
    this.img = SpriteDestructor.asset('btn-rate');
  }

  public click(): void {
    // Do rate
    // Open new Tab the goto to Github Repository

    // Hard Coded
    openInNewTab('https://github.com/jxmked/Flappybird');
  }
}
