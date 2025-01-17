export type IStoreValue = string | number | boolean;
export interface IData {
  type: IStoreValue;
  value: string;
}

export default class Storage {
  private static sk: RegExpMatchArray | null | string = window.location.href
    .toString()
    .match(/([a-zA-Z-]+\.github\.io\/[a-zA-Z\-.]+\/)/i);
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
    return btoa(encodeURIComponent(data));
  }

  static atou(b64: string): string {
    return decodeURIComponent(atob(b64));
  }

  static save(key: string, value: IStoreValue): void {
    if (!Storage.isAvailable) {
      console.warn('Storage is not available');
      return;
    }
    const mode = typeof value;
    if (typeof value !== 'string') {
      value = String(value);
    }
    window.localStorage.setItem(
      `__${Storage.sk! as string}_${key}__`,
      Storage.utoa(JSON.stringify({ mode, value }))
    );
  }

  static get(key: string): IStoreValue | undefined {
    if (!Storage.isAvailable) {
      console.warn('Storage is not available');
      return void 0;
    }

    try {
      const read_item = window.localStorage.getItem(
        `__${Storage.sk! as string}_${key}__`
      );

      if (!read_item) return void 0;

      const obj = JSON.parse(Storage.atou(read_item)) as IData;

      let return_value: IStoreValue | undefined = void 0;

      switch (obj.type) {
        case 'string':
          return_value = String(obj.value);
          break;
        case 'number':
          return_value = Number(obj.value);
          break;
        case 'boolean':
          return_value = obj.value === 'true' ? true : false;
          break;
      }

      return return_value;
    } catch (err) {
      console.error('Failed to fetch highscore');
      return void 0;
    }
  }
}
