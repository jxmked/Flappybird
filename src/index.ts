import './styles/main.scss';
import raf from 'raf';
import prepareAssets from './asset-preparation';
import GameObject from './game';
import { rescaleDim, framer as Framer } from './utils';

if (document.querySelector('[name=app_mode]')!.getAttribute('content') === 'production') {
  // Load Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}


const canvas = document.querySelector('#main-canvas')! as HTMLCanvasElement;
const canvasDimension = {
  width: 1080 * 2,
  height: 1755 * 2
};

/**
 * While waiting to all assets to load
 * All event that has possibilities to call
 * during loading state should be preserve.
 * */
const stacks: Function[] = [];

const Game = new GameObject(canvas);
const fps = new Framer(Game.context);

fps.text({
  x: 50, y: 50
}, "", " Cycle");
fps.container({
  x: 10, 
  y: 10,
}, {
  x: 230,
  y: 70
});

/**
 * Update the game
 * */
const GameUpdate = (): void => {
  Game.Update();
  fps.mark()
  raf(GameUpdate);
};

const GameDisplay = (): void => {
  Game.Display();
  
  raf(GameDisplay);
}

const ScreenResize = () => {
  const { innerWidth, innerHeight } = window;
  let sizeResult: IDimension;

  if (innerHeight < innerWidth) {
    // Reize the canvas
    sizeResult = rescaleDim(canvasDimension, { width: innerWidth });
  } else {
    sizeResult = rescaleDim(canvasDimension, { height: innerHeight });
  }

  canvas.height = sizeResult.height;
  canvas.width = sizeResult.width;
  Game.Resize(sizeResult);
};

window.addEventListener('DOMContentLoaded', () => {
  // Load Assets
  prepareAssets(() => {
    // Begin
    Game.init();
    ScreenResize();

    for (const stack of stacks) {
      stack();
    }
    raf(GameDisplay);
    raf(GameUpdate);
  });
});

window.addEventListener('resize', () => {
  stacks.push(ScreenResize);
});
