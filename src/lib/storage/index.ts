import { ENV } from '../../constants';
import { fromUint8Array, toUint8Array } from 'js-base64';

export type IStoreValue = 'string' | 'number' | 'boolean';
export interface IData {
  type: IStoreValue;
  value: string;
}

export default class Storage {
  private static sk = `${ENV.APP_NAME}_${ENV.PROJECT_NAME}`;
  private static isAvailable: boolean;

  constructor() {
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

  static save(key: string, value: string | number | boolean): void {
    if (!Storage.isAvailable) {
      console.warn('Storage is not available');
      return;
    }

    const page_key = this.utoa(Storage.sk);
    const old_data = window.localStorage.getItem(page_key);
    const data: Record<string, IData> = {};

    if (old_data !== null) {
      try {
        const byte = toUint8Array(old_data);
        const decoded = new TextDecoder().decode(byte);
        Object.assign(data, JSON.parse(decoded));
      } catch (err) {
        console.log('Failed to save data');
      }
    }

    const type = typeof value as IStoreValue;

    if (type !== 'string') {
      value = String(value);

      data[key] = {
        type,
        value
      };
    }

    const result_value = JSON.stringify(data);
    const encoded = new TextEncoder().encode(result_value);
    const base64 = fromUint8Array(encoded);

    window.localStorage.setItem(page_key, base64);
  }

  static get(key: string): string | number | boolean | undefined {
    if (!Storage.isAvailable) {
      console.warn('Storage is not available');
      return void 0;
    }

    try {
      const page_key = this.utoa(Storage.sk);
      const old_data = window.localStorage.getItem(page_key);
      const data: Record<string, IData> = {};

      if (old_data !== null) {
        const byte = toUint8Array(old_data);
        const decoded = new TextDecoder().decode(byte);
        Object.assign(data, JSON.parse(decoded));
      } else {
        return void 0;
      }

      const target = data[key];

      switch (target.type) {
        case 'string':
          return String(target.value);

        case 'number':
          return Number(target.value);

        case 'boolean':
          return target.value === 'true' ? true : false;
      }
    } catch (err) {
      console.warn('Failed to fetch data');
      return void 0;
    }
  }
}
