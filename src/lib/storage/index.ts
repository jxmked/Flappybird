export interface IData {
  mode: string;
  value: string;
}

export default class Storage {
  private static sk: RegExpMatchArray | null | string = window.location
    .href!.toString()
    .match(/([a-zA-Z\-]+\.github\.io\/[a-zA-Z\-\.]+\/)/i);
  private static isAvailable: boolean;

  constructor() {
    if ((Storage.sk ?? []).length < 1) Storage.sk = ['brrrrrrrrrrr'];
    Storage.sk = Storage.utoa(Storage.sk![0]);

    Storage.isAvailable = false;

    try {
      if ('localStorage' in window && typeof window.localStorage === 'object') {
        Storage.isAvailable = true;
      }
    } catch (err) {
      Storage.isAvailable = false;
    }
  }
  static utoa(data: string): string {
    return btoa(unescape(encodeURIComponent(data)));
  }

  static atou(b64: string): string {
    return decodeURIComponent(escape(atob(b64)));
  }

  static save(key: string, value: string | number | boolean): void {
    if (!Storage.isAvailable) {
      console.warn('Storage is not available');
      return;
    }
    let mode = typeof value;
    if (typeof value !== 'string') {
      value = String(value);
    }
    window.localStorage.setItem(
      `__${Storage.sk!}_${key}__`,
      Storage.utoa(JSON.stringify({ mode, value }))
    );
  }

  static get(key: string): string | number | boolean | undefined {
    if (!Storage.isAvailable) {
      console.warn('Storage is not available');
      return;
    }

    try {
      const obj = JSON.parse(
        Storage.atou(window.localStorage.getItem(`__${Storage.sk!}_${key}__`)!)
      ) as IData;

      if (obj.mode ?? false) {
        switch (obj.mode) {
          case 'string':
            return obj.value ?? '';
          case 'number':
            return Number(obj.value ?? 0);
          case 'boolean':
            return (obj.value ?? false) && obj.value === 'true' ? true : false;
        }
      }

      return void 0;
    } catch (err) {
      console.error('Failed to fetch highscore');
      return void 0;
    }
  }
}
