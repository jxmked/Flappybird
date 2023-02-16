/**
 * Display "FlappyBird"
 * Display the bird close to the middle and at the center
 *
 * Display "Play", "Rate" buttons and maybe include the
 * "Ranking" button but with no function. Just to mimic the
 * original game
 * */

import ParentClass from '../abstracts/parent-class';
import BirdModel from '../model/bird';

export default class Introduction extends ParentClass {
  bird: BirdModel;

  constructor() {
    super();
    this.bird = new BirdModel();
  }

  init(): void {}

  resize({ width, height }: IDimension): void {
    super.resize({ width, height });
    this.bird.resize({ width, height });
  }

  Update(): void {}

  Display(context: CanvasRenderingContext2D): void {}
}
