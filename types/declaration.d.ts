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

declare const process: {
  readonly env: {
    APP_VERSION: string;
    NODE_ENV: 'development' | 'production';
    APP_NAME: string;
    APP_SHORT_NAME: string;
    APP_DESCRIPTION: string;
    APP_HOMEPAGE: string;
    APP_REPOSITORY: string;
    AUTHOR: string;
    PROJECT_NAME: string;
    BUILD_DATE: string;
    availableOffline: boolean;
    backgroundColor: string;
    themeColor: string;
    windowResizeable: boolean;
    [key: string]: string | undefined;
  };
};
