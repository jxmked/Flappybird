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
import PlayButton from '../model/btn-play';

export default class Introduction extends ParentClass {
  bird: BirdModel;
  playButton: PlayButton;

  constructor() {
    super();
    this.bird = new BirdModel();
    this.playButton = new PlayButton();
  }

  init(): void {
    this.playButton.init();
  }

  resize({ width, height }: IDimension): void {
    super.resize({ width, height });
    this.bird.resize({ width, height });
    this.playButton.resize({ width, height });
  }

  Update(): void {
    this.playButton.Update();
  }

  Display(context: CanvasRenderingContext2D): void {
    this.playButton.Display(context);
  }

  mouseDown({ x, y }: ICoordinate): void {
    this.playButton.mouseEvent('down', { x, y });
  }

  mouseUp({ x, y }: ICoordinate): void {
    this.playButton.mouseEvent('up', { x, y });
  }
}
