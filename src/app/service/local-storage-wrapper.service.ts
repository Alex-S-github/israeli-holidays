import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageWrapperService {
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);

    if (item) {
      return JSON.parse(item) as T;
    }

    return null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
