import PlayButton from './btn-play'; // Instead of duplicating
import { asset } from '../lib/sprite-destructor';

/**
 * Instead of creating everything from scratch
 * Let us depend on PlayButton since they are
 * identical and just their image, x-axis, and
 * on click event are different
 * */
export default class RankingButton extends PlayButton {
  constructor() {
    super();
    this.coordinate.x = 0.741;
  }

  public init(): void {
    this.img = asset('btn-ranking');
  }
}
