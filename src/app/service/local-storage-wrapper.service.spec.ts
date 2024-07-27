import { TestBed } from '@angular/core/testing';

import { LocalStorageWrapperService } from './local-storage-wrapper.service';

describe('LocalStorageWrapperService', () => {
  let service: LocalStorageWrapperService;

  const key = 'testKey';
  const value = { data: 'testData' };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageWrapperService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set an item in localStorage', () => {
    service.setItem(key, value);
    expect(localStorage.getItem(key)).toEqual(JSON.stringify(value));
  });

  it('should get an item from localStorage', () => {
    localStorage.setItem(key, JSON.stringify(value));
    const result = service.getItem<typeof value>(key);
    expect(result).toEqual(value);
  });

  it('should return null if item does not exist in localStorage', () => {
    const result = service.getItem<typeof value>('nonExistentKey');
    expect(result).toBeNull();
  });

  it('should remove an item from localStorage', () => {
    localStorage.setItem(key, JSON.stringify(value));
    service.removeItem(key);
    expect(localStorage.getItem(key)).toBeNull();
  });

  it('should not affect other items in localStorage when removing one item', () => {
    const anotherKey = 'anotherKey';
    const anotherValue = { otherData: 'otherValue' };

    localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem(anotherKey, JSON.stringify(anotherValue));
    service.removeItem(key);

    expect(localStorage.getItem(key)).toBeNull();
    expect(localStorage.getItem(anotherKey)).toEqual(
      JSON.stringify(anotherValue)
    );
  });

  it('should handle removing a non-existent item gracefully', () => {
    service.removeItem('nonExistentKey');
    expect(localStorage.getItem(key)).toBeNull();
  });
});
