import './styles/main.scss';

import { framer as Framer, rescaleDim } from './utils';

import { CANVAS_DIMENSION } from './constants';
import EventHandler from './events';
import GameObject from './game';
import prepareAssets from './asset-preparation';
import raf from 'raf';

/* Working on this
if (process.env.NODE_ENV !== 'development') {
  // Load Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('sw.js')
        .then((registration) => {
          console.log('SW registered');
        })
        .catch((registrationError) => {
          console.log('SW registration failed');
        });
    });
  }
} */

// Do double buffering
// I think, this may reduce framedrop from different browser
const bufferCanvas = document.createElement('canvas') as HTMLCanvasElement;
const canvas = document.querySelector('#main-canvas')! as HTMLCanvasElement;

const loadingScreen = document.querySelector('#loading-modal')! as HTMLDivElement;
let isLoaded = false;

const physicalContext = canvas.getContext('2d')!;
/**
 * While waiting to all assets to load
 * All event that has possibilities to call
 * during loading state should be preserve.
 * */
const stacks: Function[] = [];

const Game = new GameObject(bufferCanvas);
const fps = new Framer(Game.context);

// prettier-ignore
fps.text({ x: 50, y: 50 }, '', ' Cycle');
// prettier-ignore
fps.container({ x: 10, y: 10}, { x: 230, y: 70});

/**
 * Update the game
 * */
const GameUpdate = (): void => {
  Game.Update();
  Game.Display();

  if (process.env.NODE_ENV === 'development') fps.mark();

  raf(GameUpdate);
};

const UpdateView = (): void => {
  physicalContext.drawImage(bufferCanvas, 0, 0, bufferCanvas.width, bufferCanvas.height);
  raf(UpdateView);
};

const ScreenResize = () => {
  const sizeResult = rescaleDim(CANVAS_DIMENSION, { height: window.innerHeight - 50 });

  // Adjust the canvas DOM size
  canvas.style.maxWidth = String(sizeResult.width) + 'px';
  canvas.style.maxHeight = String(sizeResult.height) + 'px';

  sizeResult.width = sizeResult.width * 2;
  sizeResult.height = sizeResult.height * 2;

  // Adjust Canvas Drawing Size
  bufferCanvas.height = sizeResult.height;
  bufferCanvas.width = sizeResult.width;

  canvas.height = sizeResult.height;
  canvas.width = sizeResult.width;

  console.log(`Canvas Size: ${sizeResult.width}x${sizeResult.height}`);

  Game.Resize(sizeResult);
};

window.addEventListener('DOMContentLoaded', () => {
  // Load Assets
  prepareAssets(() => {
    isLoaded = true;
    // Begin
    Game.init();
    ScreenResize();

    for (const stack of stacks) {
      stack();
    }

    raf(GameUpdate);
    raf(UpdateView);

    if (process.env.NODE_ENV === 'development') {
      EventHandler(Game, canvas);
      loadingScreen.style.display = 'none';
      document.body.style.backgroundColor = 'rgba(28, 28, 30, 1)';
      return;
    }

    window.setTimeout(() => {
      // Listen to events: Mouse, Touch, Keyboard
      EventHandler(Game, canvas);
      loadingScreen.style.display = 'none';
      document.body.style.backgroundColor = 'rgba(28, 28, 30, 1)';
    }, 1500);
  });
});

window.addEventListener('resize', () => {
  if (!isLoaded) {
    stacks.push(ScreenResize);
    return;
  }

  ScreenResize();
});
