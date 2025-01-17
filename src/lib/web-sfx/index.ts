/**
 * A library for handling sound Effects
 * Handling Sound Effects
 * */

export type IWebSfxObject = Record<string, string>;
export type IWebSfxCache = Record<string, AudioBuffer>;
export interface ILoadRequest {
  content: AudioBuffer;
  name: string;
  path: string;
}

declare let webkitAudioContext: AudioContext;

export interface IWebSfxOptions {
  autoInitAudioContext: boolean;
  files: IWebSfxObject;
}

export default class WebSfx {
  public static audioContext: AudioContext;
  private static Cached: IWebSfxCache = {};
  private static concurrentDownload = 5;
  private static gainContext: undefined | GainNode;
  private static isReady = false;

  /**
   * The constructor function takes two arguments, files and callback. The files argument is an object
   * that contains the file names of the audio files that you want to load. The callback argument is a
   * function that will be called when all of the audio files have been loaded
   * @param {IWebSfxObject} files - IWebSfxObject - This is an object that contains the files you want
   * to load.
   * @param {Function} callback - A function that will be called when all the files have been loaded.
   */
  constructor(files: IWebSfxObject, callback: IEmptyFunction) {
    WebSfx.audioContext = new (AudioContext || webkitAudioContext)();

    WebSfx.audioContext.addEventListener('statechange', () => {
      WebSfx.isReady = WebSfx.audioContext.state === 'running';
    });

    WebSfx.load(files, callback);
  }

  /**
   * It creates a buffer source, connects it to the gain node, and starts it
   * @param {string} key - string - The key of the audio file to play.
   * @returns Void.
   */
  public static play(key: string, endedcb?: IEmptyFunction): void {
    if (typeof WebSfx.Cached[key] === void 0) {
      throw new TypeError(`Key ${key} does not load or not exists.`);
    }

    if (WebSfx.gainContext === void 0) {
      console.warn('WebSfx.play cannot execute. AudioContext is not started or resumed');
      return;
    }

    if (!WebSfx.isReady) return;

    try {
      const context = WebSfx.audioContext!;
      const bufferSource = context.createBufferSource();
      bufferSource.buffer = WebSfx.Cached[key];
      bufferSource.addEventListener('ended', () => endedcb?.());
      bufferSource.connect(WebSfx.gainContext!);
      bufferSource.start();
    } catch (err) {
      throw new Error(`Failed to play audio: ${key}. Error: ${err}`);
    }
  }

  /**
   * If the gainContext is not undefined, then set the gainContext's gain value to the number passed
   * in.
   * @param {number} num - number - The volume level to set. 0.0 is silent, 1.0 is full volume.
   * @returns Void.
   */
  public static volume(num: number): void {
    if (WebSfx.gainContext === void 0) {
      console.warn(
        'WebSfx.volume cannot set volume. AudioContext is not started or resumed'
      );
      return;
    }

    try {
      WebSfx.gainContext!.gain.value = num;
    } catch (err) {}
  }

  /**
   * If the audioContext is ready, then return. Otherwise, resume the audioContext and create a gain
   * node.
   * @returns Promise<void>
   */
  public static async init(): Promise<void> {
    /**
     * Sometimes, WebSfx.audioContext.state returns "running" that makes
     * WebSfx.isReady to true. However, we can check the WebSfx.gainContext
     * if is set or not since it cannot be created without starting or resuming
     * the audioContext.
     * */
    if (WebSfx.isReady && WebSfx.gainContext !== void 0) return;

    // We should start after user event
    await WebSfx.audioContext.resume();

    const gain = WebSfx.audioContext.createGain();

    // Output channel
    gain.connect(WebSfx.audioContext.destination);
    WebSfx.gainContext = gain;
  }

  /**
   * Loading Assets Section
   * */
  private static load(files: IWebSfxObject, complete: IEmptyFunction, level = 0): void {
    const loading = [];
    const entries = Object.entries(files);

    /**
     * Do not load all files at once.
     * */
    for (
      let i = level * WebSfx.concurrentDownload;
      i < Math.min(entries.length, WebSfx.concurrentDownload);
      i++
    ) {
      // Validating files
      if (!/\.(wav|ogg|mp3)$/i.test(entries[i][1])) {
        throw new TypeError("WebSfx.contructor accepts 'wav|ogg|mp3' type of files");
      }

      loading.push(WebSfx.load_requests(entries[i][0], entries[i][1]));
    }

    Promise.allSettled(loading).then((results) => {
      // Store the buffer in WebSfx.Cached
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          WebSfx.Cached[result.value.name] = result.value.content;
          WebSfx.Cached[result.value.path] = WebSfx.Cached[result.value.name];
        } else {
          // What can I do to rejected?
        }
      });

      if (entries.length > (level + 1) * WebSfx.concurrentDownload) {
        WebSfx.load(files, complete, level + 1);
      } else {
        complete(WebSfx.Cached);
      }
    });
  }

  private static load_requests(name: string, path: string): Promise<ILoadRequest> {
    return new Promise<ILoadRequest>(async (resolve: Function, reject: Function) => {
      try {
        const response = await fetch(path, { method: 'GET', mode: 'no-cors' });

        if (!response.ok) throw new TypeError(`Erro while fetching '${path}`);

        // We cannot cannot cache array buffer with dettached head
        const buffer = await response.arrayBuffer();

        // But luckily, we can do cache the AudioBuffer
        const content = await WebSfx.audioContext!.decodeAudioData(buffer);

        resolve({ content, path, name });
      } catch (err) {
        reject();
      }
    });
  }
}
