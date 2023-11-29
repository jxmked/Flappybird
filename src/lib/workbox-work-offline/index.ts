/**
 * https://webpack.js.org/guides/progressive-web-application/
 * */
export default () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./service-worker.js')
        .then((registration) => {
          console.log('SW registered');
        })
        .catch((registrationError) => {
          console.log('SW registration failed');
        });
    });
  }
};
