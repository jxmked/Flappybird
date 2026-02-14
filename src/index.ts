import './styles/main.scss';
import gameSpriteIcon from './assets/icon.png';
import '@total-typescript/ts-reset';

import { framer as Framer, rescaleDim } from './utils';
import { CANVAS_DIMENSION } from './constants';
import EventHandler from './events';
import GameObject from './game';
import prepareAssets from './asset-preparation';
import raf from 'raf';
import SwOffline from './lib/workbox-work-offline';

/**
 * Enabling desynchronized to reduce latency
 * but the frame tearing may experience so
 * we'll need double buffer to atleast reduce
 * the frame tearing
 * */
const virtualCanvas = document.createElement('canvas');
const gameIcon = document.createElement('img');
const canvas = document.querySelector<HTMLCanvasElement>('#main-canvas')!;
const physicalContext = canvas.getContext('2d')!;
const loadingScreen = document.querySelector<HTMLDivElement>('#loading-modal')!;
const Game = new GameObject(virtualCanvas);
const fps = new Framer(Game.context);

let isLoaded = false;

gameIcon.src = gameSpriteIcon;

// prettier-ignore
fps.text({ x: 50, y: 50 }, '', ' FPS');
// prettier-ignore
fps.container({ x: 10, y: 10 }, { x: 180, y: 60 });

// Make the app available offline
if (process.env.NODE_ENV === 'production') {
  if (process.env.availableOffline) SwOffline();
} else {
  // Framer.SHOW_FPS = true;
}

let init_time = 0;
const GameUpdate = (): void => {
  physicalContext.drawImage(virtualCanvas, 0, 0);
  const c = performance.now();
  const dt = (c - init_time) / 1000;
  init_time = c;

  Game.Update(dt);
  Game.Display();

  fps.PROD_SHOW_FPS();

  raf(GameUpdate);
};

const ScreenResize = () => {
  const sizeResult = rescaleDim(CANVAS_DIMENSION, {
    height: window.innerHeight * 2 - 50
  });

  canvas.style.maxWidth = String(sizeResult.width / 2) + 'px';
  canvas.style.maxHeight = String(sizeResult.height / 2) + 'px';

  canvas.height = sizeResult.height;
  canvas.width = sizeResult.width;
  virtualCanvas.height = sizeResult.height;
  virtualCanvas.width = sizeResult.width;

  console.log(`Canvas Size: ${sizeResult.width}x${sizeResult.height}`);

  Game.Resize(sizeResult);
};

const removeLoadingScreen = () => {
  EventHandler(Game, canvas);
  loadingScreen.style.display = 'none';
  document.body.style.backgroundColor = 'rgba(28, 28, 30, 1)';
};

window.addEventListener('DOMContentLoaded', () => {
  loadingScreen.insertBefore(gameIcon, loadingScreen.childNodes[0]);

  prepareAssets(() => {
    isLoaded = true;

    Game.init();

    ScreenResize();

    init_time = performance.now();
    raf(GameUpdate);

    if (process.env.NODE_ENV === 'development') removeLoadingScreen();
    else window.setTimeout(removeLoadingScreen, 1000);
  });
});

window.addEventListener('resize', () => {
  if (!isLoaded) return;

  ScreenResize();
});
