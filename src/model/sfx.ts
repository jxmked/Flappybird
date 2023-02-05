import sfDie from '../assets/audio/die.ogg';
import sfHit from '../assets/audio/hit.ogg';
import sfPoint from '../assets/audio/point.ogg';
import sfSwoosh from '../assets/audio/swoosh.ogg';
import sfWing from '../assets/audio/wing.ogg';
//import {createjs  } from 'soundjs';
import { asset } from '../utils';


export default class Sfx {
  static sounds:{[key:string]:HTMLAudioElement};
  
  constructor() {
    Sfx.sounds = {}
  }
  
  init() {
    Sfx.sounds = {
      die: asset(sfDie),
      hit: asset(sfHit),
      point: asset(sfPoint),
      swoosh: asset(sfSwoosh),
      wing: asset(sfWing)
    }
    
   /* createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.on("fileload", () => {}, this);
    createjs.Sound.registerSound(sfHit, "sound"); */
   /*  function loadHandler(event) {
         // This is fired for each sound that is registered.
         var instance = createjs.Sound.play("sound");  // play using id.  Could also use full sourcepath or event.src.
         instance.on("complete", this.handleComplete, this);
         instance.volume = 0.5;
     } */
    
    Sfx.volume(1)
  }
  
  static stop() {
    for(const index in Sfx.sounds) {
      Sfx.sounds[index].currentTime = 0;
      Sfx.sounds[index].pause();
    }
  }
  
  static volume(percent:number): void {
    for(const index in Sfx.sounds) {
      Sfx.sounds[index].volume = percent;
    }
  }
  
  static die():void {
    Sfx.sounds.die.play();
  }
  
  static point(): void {
    Sfx.sounds.point.play()
  }
  
  static hit(): void {
    
    const instance = createjs
    //Sfx.sounds.hit.play();
  }
  
  static swoosh(): void {
    Sfx.sounds.swoosh.play();
  }
  
  static wing(): void {
    Sfx.sounds.wing.currentTime = 0.010
    //Sfx.sounds.wing.pause();
    Sfx.sounds.wing.play();
  }
  
}