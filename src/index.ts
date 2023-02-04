import './styles/main.scss';
import AssetLoader from './lib/asset-loader';
//import raf from 'raf';
import { rescaleDim } from './utils';

if(document.querySelector('[name=app_mode]')!.getAttribute('content') === "production"){
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
