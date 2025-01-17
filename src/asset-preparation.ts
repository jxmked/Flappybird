import AssetLoader from './lib/asset-loader';

import SpriteDestructor from './lib/sprite-destructor';
import WebSfx from './lib/web-sfx';
import atlas from './assets/atlas.png';
import sfDie from './assets/audio/die.ogg';
import sfHit from './assets/audio/hit.ogg';
import sfPoint from './assets/audio/point.ogg';
import sfSwoosh from './assets/audio/swooshing.ogg';
import sfWing from './assets/audio/wing.ogg';

export default (callback: IEmptyFunction): void => {
  let isLoaded = false;

  // Do not load images and sfx at the same time
  new AssetLoader([atlas]).then(() => {
    const sd = new SpriteDestructor(AssetLoader.get<HTMLImageElement>(atlas));

    sd.cutOut('theme-day', 0, 0, 288, 512);
    sd.cutOut('theme-night', 292, 0, 288, 512);
    sd.cutOut('platform', 584, 0, 236, 112);
    sd.cutOut('pipe-red-top', 0, 646, 52, 320);
    sd.cutOut('pipe-red-bottom', 56, 646, 52, 320);
    sd.cutOut('pipe-green-bottom', 168, 646, 52, 320);
    sd.cutOut('pipe-green-top', 112, 646, 52, 320);
    sd.cutOut('score-board', 4, 516, 232, 123);
    sd.cutOut('coin-dull-metal', 224, 906, 44, 44);
    sd.cutOut('coin-dull-bronze', 224, 954, 44, 44);
    sd.cutOut('coin-shine-silver', 242, 516, 44, 44);
    sd.cutOut('coin-shine-gold', 242, 564, 44, 44);
    sd.cutOut('number-sm-0', 276, 646, 12, 14);
    sd.cutOut('number-sm-1', 282, 664, 6, 14);
    sd.cutOut('number-sm-2', 276, 698, 12, 14);
    sd.cutOut('number-sm-3', 276, 716, 12, 14);
    sd.cutOut('number-sm-4', 276, 750, 12, 14);
    sd.cutOut('number-sm-5', 276, 768, 12, 14);
    sd.cutOut('number-sm-6', 276, 802, 12, 14);
    sd.cutOut('number-sm-7', 276, 820, 12, 14);
    sd.cutOut('number.sm-8', 276, 854, 12, 14);
    sd.cutOut('number-sm-9', 276, 872, 12, 14);
    sd.cutOut('number-md-0', 274, 612, 14, 20);
    sd.cutOut('number-md-1', 278, 954, 10, 20);
    sd.cutOut('number-md-2', 274, 978, 14, 20);
    sd.cutOut('number-md-3', 262, 1002, 14, 20);
    sd.cutOut('number-md-4', 1004, 0, 14, 20);
    sd.cutOut('number-md-5', 1004, 24, 14, 20);
    sd.cutOut('number-md-6', 1010, 52, 14, 20);
    sd.cutOut('number-md-7', 1010, 84, 14, 20);
    sd.cutOut('number-md-8', 586, 484, 14, 20);
    sd.cutOut('number-md-9', 622, 412, 14, 20);
    sd.cutOut('number-lg-0', 992, 120, 24, 36);
    sd.cutOut('number-lg-1', 272, 910, 16, 36);
    sd.cutOut('number-lg-2', 584, 320, 24, 36);
    sd.cutOut('number-lg-3', 612, 320, 24, 36);
    sd.cutOut('number-lg-4', 640, 320, 24, 36);
    sd.cutOut('number-lg-5', 668, 320, 24, 36);
    sd.cutOut('number-lg-6', 584, 368, 24, 36);
    sd.cutOut('number-lg-7', 612, 368, 24, 36);
    sd.cutOut('number-lg-8', 640, 368, 24, 36);
    sd.cutOut('number-lg-9', 668, 368, 24, 36);
    sd.cutOut('toast-new', 224, 1002, 32, 14);
    sd.cutOut('btn-pause', 242, 612, 26, 28);
    sd.cutOut('btn-share', 584, 284, 80, 28);
    sd.cutOut('btn-play-icon', 668, 284, 26, 28);
    sd.cutOut('btn-play', 706, 236, 110, 64);
    sd.cutOut('btn-ranking', 826, 236, 110, 64);
    sd.cutOut('btn-menu', 924, 52, 80, 28);
    sd.cutOut('btn-ok', 924, 84, 80, 28);
    sd.cutOut('btn-rate', 926, 2, 70, 44);
    sd.cutOut('bird-yellow-up', 6, 982, 34, 24);
    sd.cutOut('bird-yellow-mid', 62, 982, 34, 24);
    sd.cutOut('bird-yellow-down', 118, 982, 34, 24);
    sd.cutOut('bird-blue-up', 174, 982, 34, 24);
    sd.cutOut('bird-blue-mid', 230, 658, 34, 24);
    sd.cutOut('bird-blue-down', 230, 710, 34, 24);
    sd.cutOut('bird-red-up', 230, 762, 34, 24);
    sd.cutOut('bird-red-mid', 230, 814, 34, 24);
    sd.cutOut('bird-red-down', 230, 866, 34, 24);
    sd.cutOut('spark-sm', 276, 682, 10, 10);
    sd.cutOut('spark-md', 276, 734, 10, 10);
    sd.cutOut('spark-lg', 276, 786, 10, 10);
    sd.cutOut('banner-game-ready', 586, 118, 192, 58);
    sd.cutOut('banner-game-over', 786, 118, 200, 52);
    sd.cutOut('banner-flappybird', 702, 182, 178, 52);
    sd.cutOut('banner-instruction', 584, 182, 114, 98);
    sd.cutOut('copyright', 886, 184, 122, 10);
    sd.cutOut('icon-plus', 992, 168, 10, 10);
    sd.cutOut('btn-mute', 816, 306, 90, 66);
    sd.cutOut('btn-speaker', 712, 306, 90, 66);

    const loadCallback = () => {
      if (isLoaded) callback();
      isLoaded = true;
    };

    // Make sure this one is at the very bottom of SpriteDestructor.cutOut
    void sd.then(loadCallback);

    new WebSfx(
      {
        hit: sfHit,
        wing: sfWing,
        swoosh: sfSwoosh,
        die: sfDie,
        point: sfPoint
      },
      loadCallback
    );
  });
};
