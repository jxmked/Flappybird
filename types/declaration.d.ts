declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.ogg' {
  const value: string;
  export default value;
}

declare module '*.scss';
declare module '*.sass';
declare module '*.css';

declare let WebKitMutationObserver: MutationObserver;
