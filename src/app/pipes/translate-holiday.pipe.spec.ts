import { TranslateHolidayPipe } from './translate-holiday.pipe';
import { TranslateService } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';

describe('TranslateHolidayPipe', () => {
  let pipe: TranslateHolidayPipe;
  let translateService: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);

    TestBed.configureTestingModule({
      providers: [
        TranslateHolidayPipe,
        { provide: TranslateService, useValue: translateSpy },
      ],
    });

    pipe = TestBed.inject(TranslateHolidayPipe);
    translateService = TestBed.inject(
      TranslateService
    ) as jasmine.SpyObj<TranslateService>;
  });

  it('should translate a regular holiday name', () => {
    translateService.instant.and.returnValue('Translated Holiday');

    const result = pipe.transform('SomeHoliday');

    expect(result).toBe('Translated Holiday');
    expect(translateService.instant).toHaveBeenCalledWith(
      'HOLIDAY.SomeHoliday'
    );
  });

  it('should translate "Rosh Hashana" including the year', () => {
    translateService.instant.and.returnValue('Translated Rosh Hashana');

    const result = pipe.transform('Rosh Hashana 5784');

    expect(result).toBe('Translated Rosh Hashana 5784');
    expect(translateService.instant).toHaveBeenCalledWith(
      'HOLIDAY.Rosh Hashana'
    );
  });

  it('should cache the translated result', () => {
    translateService.instant.and.returnValue('Translated Holiday');

    const firstCall = pipe.transform('SomeHoliday');
    const secondCall = pipe.transform('SomeHoliday');

    expect(secondCall).toBe(firstCall);
    expect(translateService.instant).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple different holiday translations', () => {
    translateService.instant
      .withArgs('HOLIDAY.HolidayOne')
      .and.returnValue('Translated Holiday One');
    translateService.instant
      .withArgs('HOLIDAY.HolidayTwo')
      .and.returnValue('Translated Holiday Two');

    const result1 = pipe.transform('HolidayOne');
    const result2 = pipe.transform('HolidayTwo');

    expect(result1).toBe('Translated Holiday One');
    expect(result2).toBe('Translated Holiday Two');
    // Should call translate service twice for different holidays
    expect(translateService.instant).toHaveBeenCalledTimes(2);
  });

  it('should return cached value for already translated holidays', () => {
    translateService.instant.and.returnValue('Translated Holiday');
    pipe.transform('SomeHoliday');
    const result = pipe.transform('SomeHoliday');
    expect(result).toBe('Translated Holiday');
    expect(translateService.instant).toHaveBeenCalledTimes(1);
  });
});
