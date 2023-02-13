// @ts-nocheck

import sfDie from './assets/audio/die.ogg';
import sfHit from './assets/audio/hit.ogg';
import sfPoint from './assets/audio/point.ogg';
import sfSwoosh from './assets/audio/swoosh.ogg';
import sfWing from './assets/audio/wing.ogg';
import mainIcon from './assets/icon.png';
import pipeTopGreen from './assets/sprites/pipe/top-green.png';
import pipeBottomRed from './assets/sprites/pipe/bottom-red.png';
import pipeBottomGreen from './assets/sprites/pipe/bottom-green.png';
import pipeTopRed from './assets/sprites/pipe/top-red.png';
import bgDay from './assets/sprites/background/day.png';
import bgNight from './assets/sprites/background/night.png';
import birdYellowMidFlap from './assets/sprites/bird/yellow-mid-flap.png';
import birdYellowDownFlap from './assets/sprites/bird/yellow-down-flap.png';
import birdRedUpFlap from './assets/sprites/bird/red-up-flap.png';
import birdRedMidFlap from './assets/sprites/bird/red-mid-flap.png';
import birdRedDownFlap from './assets/sprites/bird/red-down-flap.png';
import birdBlueUpFlap from './assets/sprites/bird/blue-up-flap.png';
import birdBlueMidFlap from './assets/sprites/bird/blue-mid-flap.png';
import birdBlueDownFlap from './assets/sprites/bird/blue-down-flap.png';
import birdYellowUpFlap from './assets/sprites/bird/yellow-up-flap.png';
import n9 from './assets/sprites/number/9.png';
import n8 from './assets/sprites/number/8.png';
import n7 from './assets/sprites/number/7.png';
import n6 from './assets/sprites/number/6.png';
import n5 from './assets/sprites/number/5.png';
import n4 from './assets/sprites/number/4.png';
import n3 from './assets/sprites/number/3.png';
import n2 from './assets/sprites/number/2.png';
import n1 from './assets/sprites/number/1.png';
import n0 from './assets/sprites/number/0.png';
import gameInfo from './assets/sprites/message.png';
import gameOver from './assets/sprites/gameover.png';
import gamePlatform from './assets/sprites/base.png';

// For Images
import { AssetLoader } from './utils';

// For Sound Effects. Interactive Audio
import WebSfx from './lib/web-sfx';

export default (callback: Function): void => {
  const assetArray = [
    //mainIcon,
    pipeTopGreen,
    pipeBottomRed,
    pipeBottomGreen,
    pipeTopRed,
    bgDay,
    bgNight,
    birdYellowMidFlap,
    birdYellowUpFlap,
    birdYellowDownFlap,
    birdRedDownFlap,
    birdRedMidFlap,
    birdRedUpFlap,
    birdBlueDownFlap,
    birdBlueMidFlap,
    birdBlueUpFlap,
    n9,
    n8,
    n7,
    n6,
    n5,
    n4,
    n3,
    n2,
    n1,
    n0,
    /*  gameInfo,
    gameOver, */
    gamePlatform
  ];

  // Do not load images and sfx at the same time
  new AssetLoader(assetArray).then(() => {
    new WebSfx(
      {
        hit: sfHit,
        wing: sfWing,
        swoosh: sfSwoosh,
        die: sfDie,
        point: sfPoint
      },
      () => {
        callback();
      }
    );
  });
};
