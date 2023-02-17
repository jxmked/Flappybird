import Parent from '../abstracts/button-event-handler';
import { asset } from '../lib/sprite-destructor';


export default class PlayButton extends Parent {
  constructor() {
    super()
    this.initialWidth = 0.5;
    this.coordinate = {
      x: 0.5,
      y: 0.5
    }
  }
  
  init(): void {
    this.img = asset('btn-play');
  }
  
  Update(): void {
    if(this.isHover) {
      console.log("hovered")
    }
  }
  
  click(): void {
    console.log("click")
  }
  
  Display(context: CanvasRenderingContext2D): void {
    
  }
  
  
  
}


