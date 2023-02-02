import './styles/main.scss';
import gtagPageview from './gtag';
import AssetLoader from './lib/asset-loader';
import raf from 'raf';
import { rescaleDim } from './utils';

// Page Viewed
gtagPageview(window.location.href.toString());

const canvas = document.querySelector('#main-canvas')! as HTMLCanvasElement;

console.log(AssetLoader);

console.log(rescaleDim);
