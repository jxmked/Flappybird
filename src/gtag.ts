/**
 * Analytics
 * */

// https://github.com/vercel/next.js/discussions/20784#discussioncomment-4101864
type WindowWithDataLayer = Window & {
  dataLayer: object[];
  gtag: (...args: WindowWithDataLayer['dataLayer']) => void;
};

declare const window: WindowWithDataLayer;

//import { observeDOM } from './utils';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
window.dataLayer = window.dataLayer || [];

const clickFunc: EventListenerOrEventListenerObject = (evt?: Event) => {
  const props: HTMLAnchorElement = (evt!.currentTarget! || evt!.target!) as HTMLAnchorElement;
  const tagName: string = props.tagName || props.nodeName;

  if (tagName !== 'A' && props.getAttribute('aria-label-navigate') !== 'on-side') return;

  gtag('event', 'url_clicked', {
    addr: props.href,
    text: encodeURIComponent(props.innerText)
  });
};

const onClickEvent: (element: HTMLElement) => void = (element: HTMLElement): void => {
  element.removeEventListener('click', clickFunc);
  element.addEventListener('click', clickFunc);
};

// Google tag (gtag.js)
(function (id: string) {
  if (!window.location.protocol.toString().startsWith('https')) return;

  const scr = document.createElement('script');
  scr.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=' + id);
  scr.async = true;
  scr.setAttribute('type', 'text/javascript');

  document.getElementsByTagName('head')[0].appendChild(scr);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };

  gtag('js', new Date());
  gtag('config', id);

  const eventFunc: () => void = () => {
    Array.prototype.forEach.call(document.getElementsByClassName('listen-on-click') as HTMLCollectionOf<HTMLElement>, (element: HTMLElement) => {
      onClickEvent(element);
    });
  };

  document.addEventListener('DOMContentLoaded', eventFunc);

  /**
   * Rescan the DOM after manipulation
   * */
  //observeDOM(document.body, eventFunc);

  // This should be on .env file but
  // It can be publicly available so...
})('G-JPJZGW7PW6');

export const RecordEvent = (attr: object) => {
  // Might throw an error if we use gtag function
  window.dataLayer.push(attr);
};

export default (url: string): void => {
  window.dataLayer.push({
    event: 'pageview',
    url: url
  });
};
