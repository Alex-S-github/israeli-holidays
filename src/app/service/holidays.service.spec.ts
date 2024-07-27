import { TestBed } from '@angular/core/testing';

import { HolidaysService } from './holidays.service';

describe('HolidaysService', () => {
  let service: HolidaysService;

  const mockData = [
    { year: 2018, weekdaysOnly: 13, allDays: 17 },
    { year: 2019, weekdaysOnly: 13, allDays: 17 },
    { year: 2020, weekdaysOnly: 10, allDays: 17 },
    { year: 2021, weekdaysOnly: 14, allDays: 17 },
    { year: 2022, weekdaysOnly: 13, allDays: 17 },
    { year: 2023, weekdaysOnly: 10, allDays: 17 },
    { year: 2024, weekdaysOnly: 14, allDays: 17 },
    { year: 2025, weekdaysOnly: 14, allDays: 17 },
    { year: 2026, weekdaysOnly: 10, allDays: 17 },
    { year: 2027, weekdaysOnly: 10, allDays: 17 },
    { year: 2028, weekdaysOnly: 14, allDays: 17 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HolidaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getHolidays', () => {
    it('should return holidays for a given year', () => {
      const year = 2023;
      const holidays = service.getHolidays(year, true);
      expect(holidays).toBeTruthy();
      expect(holidays.length).toEqual(10);
    });

    it('should filter holidays correctly based on isWeekdays parameter', () => {
      const year = 2023;
      const weekdaysOnly = service.getHolidays(year, true);
      const allDays = service.getHolidays(year, false);

      expect(weekdaysOnly.length).toBe(10);
      expect(allDays.length).toBe(17);
      expect(weekdaysOnly.length).toBeLessThanOrEqual(allDays.length);
    });

    mockData.forEach(({ year, weekdaysOnly, allDays }) => {
      it(`should return ${weekdaysOnly} weekdays for the year ${year}`, () => {
        const weekdaysOnlyResult = service.getHolidays(year, true);
        expect(weekdaysOnlyResult.length).toBe(weekdaysOnly);
        const allDaysResult = service.getHolidays(year, false);
        expect(allDaysResult.length).toBe(allDays);
      });
    });
  });

  describe('getYearsOptions', () => {
    it('should return an array of years', () => {
      const currentYear = new Date().getFullYear();
      const years = service.getYearsOptions(currentYear);

      expect(years).toBeTruthy();
      expect(years.length).toBe(61);
      expect(years).toContain(currentYear);
    });
  });

  // Mock HebrewCalendar
  describe('_getHolidays', () => {
    it('should return an array of HebrewCalendar events', () => {
      const year = 2023;
      const events = service['_getHolidays'](year);

      expect(events).toBeTruthy();
      expect(events.length).toBe(17);
    });
  });

  it('should return the initial view as "Table"', (done: DoneFn) => {
    service.setView('Table');
    service.getView().subscribe((view) => {
      expect(view).toBe('Table');
      done();
    });
    expect(service.getViewValue()).toBe('Table');
  });

  it('should set the view to "Year" and return the updated value', (done: DoneFn) => {
    service.setView('Year');
    service.getView().subscribe((view) => {
      expect(view).toBe('Year');
      done();
    });
    expect(service.getViewValue()).toBe('Year');
  });

  it('should update the current view value after setting a new view', () => {
    service.setView('Year');
    expect(service.getViewValue()).toBe('Year');
  });

  it('should return "en-GB" for "en"', () => {
    expect(service.getLocale('en')).toBe('en-GB');
  });

  it('should return "ru-RU" for "ru"', () => {
    expect(service.getLocale('ru')).toBe('ru-RU');
  });

  it('should return "he" for "he"', () => {
    expect(service.getLocale('he')).toBe('he');
  });

  it('should return "en-GB" for unknown language', () => {
    expect(service.getLocale('fr')).toBe('en-GB');
    expect(service.getLocale('')).toBe('en-GB');
    expect(service.getLocale(null as unknown as string)).toBe('en-GB');
  });

  mockData.forEach(({ year, weekdaysOnly }) => {
    it(`should update dataSource$ and dataLengthSource$ when updateFormState is called with year ${year}`, () => {
      spyOn(service, 'updateFormState').and.callThrough();
      service.updateFormState(year, true);
      expect(service.updateFormState).toHaveBeenCalledWith(year, true);
      service.getDataSource().subscribe((data) => {
        expect(data).toBeInstanceOf(Array);
      });
      service.getDataLengthSource().subscribe((dataLength: number) => {
        expect(dataLength).toEqual(weekdaysOnly);
      });
    });
  });
});
