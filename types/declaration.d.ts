declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.ogg' {
  const value: any;
  export default value;
}

declare module '*.scss';
declare module '*.sass';
declare module '*.css';

declare var WebKitMutationObserver: MutationObserver;
