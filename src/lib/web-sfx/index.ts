/**
 * A library for handling sound Effects
 * Handling Sound Effects
 * */


export type IWebSfxObject = {[key:string]:string}
export type IWebSfxCache = {[key:string]:ArrayBuffer};
export interface ILoadRequest {
  content:AudioBuffer;
  name:string;
  path:string
}

declare var webkitAudioContext: AudioContext;

export interface WebSfxOptions {
  autoInitAudioContext: boolean;
  files:IWebSfxObject;
}


export default class WebSfx {
  
  private static audioContext:AudioContext|undefined;
  private static Cached:IWebSfxCache = {}
  private static concurrentDownload = 5;
  private static gainContext:undefined|GainNode;
  public static options:WebSfxOptions = {
    autoInitAudioContext:false,
    files:{}
  }
  /**
   * Load Files and call the callback function after all files has been loaded
   * 
   * @param {string:string} = {key:path to audio}
   * @param callback = complete function
   * */
  constructor(files:IWebSfxObject, callback:Function) {

    // Validating files
    for(const index in files) {
      if(! /\.(wav|ogg|mp3)$/i.test(files[index])) {
        throw new TypeError("WebSfx.contructor accepts 'wav|ogg|mp3' type of files");
      }
    }
    
    if(WebSfx.options.autoInitAudioContext) {
      WebSfx.initAudioContext();
    }
    
    WebSfx.load(files, callback)
  }
  
  public static async play(key:string): Promise<void> {
    if(typeof WebSfx.Cached[key] === void 0) {
      throw new TypeError(`Key ${key} does not load or not exists.`);
    }
    
    if(typeof WebSfx.audioContext === void 0) {
      throw new TypeError(`WebSfx.initAudioContext requires to execute first. Execute atleast once.`);
    }
    
    try {
      const context = WebSfx.audioContext!;
      const gain = WebSfx.gainContext!;
      const bufferSource = context.createBufferSource();
      
      // Decode the buffer audio to make it playable
      bufferSource.buffer = WebSfx.Cached[key];
      bufferSource.connect(gain);
      bufferSource.start();
    } catch(err) {
      throw new Error("Failed to play audio: " + key)
    }
  }
  
  public static initAudioContext(): void {
    if(WebSfx.audioContext) return;
    
    const audioContext = new (window.AudioContext||webkitAudioContext)();
    const gain = audioContext.createGain();
    
    gain.gain.value = 0.5;
    
    gain.connect(audioContext.destination);
    
    WebSfx.gainContext = gain;
    WebSfx.audioContext = audioContext;
  }
  
  public static volume(num:number): void {
    
  }
  
  private static load(files:IWebSfxObject, complete:Function, level:number=0): void {
    const loading = [];
    const entries = Object.entries(files)
    
    /**
     * Do not load all files at once.
     * */
    for(let i = level * WebSfx.concurrentDownload; i < Math.min(entries.length, WebSfx.concurrentDownload); i++) {
      loading.push(WebSfx.load_requests(entries[i][0], entries[i][1]));
    }
    
    Promise.allSettled(loading).then((results) => {
      // Store thr buffer in WebSfx.Cached
      results.forEach((result) => {
        if(result.status === "fulfilled") {
          WebSfx.Cached[result.value.name] = result.value.content;
        } else {
          // What can I do to rejected?
        }
      })
      
      if(entries.length  > (level +1) * WebSfx.concurrentDownload) {
        WebSfx.load(files, complete, level + 1);
      } else {
        complete(WebSfx.Cached);
      }
    })
  }
  
  private static load_requests(name:string, path:string): Promise<ILoadRequest> {
    return new Promise<ILoadRequest>(async (resolve:Function, reject:Function) => {
      try {
        const response = await fetch(path, { method:"GET", mode: "no-cors"});
        
        if(! response.ok) throw new TypeError(`Erro while fetching '${path}`);
        
        const buffer = await response.arrayBuffer();
        const contextBuffer:AudioBuffer = await WebSfx.audioContext!.decodeAudioData(buffer);
        
        resolve({
          content: contextBuffer,
          path: path,
          name: name
        });
      }catch(err) {
        reject()
      }
    })
  }
}