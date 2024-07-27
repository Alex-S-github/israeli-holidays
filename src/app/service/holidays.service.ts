import { Injectable } from '@angular/core';
import {
  HebrewCalendar,
  Location,
  HolidayEvent,
  CalOptions,
} from '@hebcal/core';
import { IHolidays } from '../interfaces/holidays.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageWrapperService } from './local-storage-wrapper.service';

@Injectable({
  providedIn: 'root',
})
export class HolidaysService {
  constructor(private localStorageWrapperService: LocalStorageWrapperService) {}

  protected view$: BehaviorSubject<string> = new BehaviorSubject(
    this._setDefaultView()
  );

  private _setDefaultView(): string {
    let view = 'Table';
    let storageView = this.localStorageWrapperService.getItem('view');
    if (!!storageView && typeof storageView == 'string') {
      view = storageView;
    }
    return view;
  }

  private _dataSource$ = new BehaviorSubject<IHolidays[]>(
    this.getHolidays(new Date().getFullYear(), true)
  );
  private _dataLengthSource$ = new BehaviorSubject<number>(
    this._dataSource$.value.length
  );

  public getDataSource(): BehaviorSubject<IHolidays[]> {
    return this._dataSource$;
  }

  public getDataLengthSource(): BehaviorSubject<number> {
    return this._dataLengthSource$;
  }

  public updateFormState(year: number, onlyWeekdays: boolean): void {
    const newDataSource = this.getHolidays(year, onlyWeekdays);
    this._dataSource$.next(newDataSource);
    this._dataLengthSource$.next(newDataSource.length);
  }

  public getHolidays(
    year: number,
    isWeekdays: boolean | undefined | null = true
  ): IHolidays[] {
    return this._getHolidays(year)
      .map((holiday: any) => {
        const hd = holiday.getDate();
        const date = hd.greg();
        return {
          name: holiday?.linkedEvent?.desc || holiday.desc,
          date: !!holiday.eventTime ? holiday.eventTime : date,
          isWeekdays:
            new Date(date).getDay() !== 5 && new Date(date).getDay() !== 6,
          isHalfDay:
            holiday.desc == 'Yom HaZikaron' ||
            holiday.mask === 1048578 ||
            holiday.mask === 1048594 ||
            holiday.mask === 2097170 ||
            holiday.mask === 2097154,
        };
      })
      .filter((holiday) => {
        if (isWeekdays) {
          // Returns objects whose isWeekdays is true
          return holiday.isWeekdays == true;
        }
        // Return all holidays, when filtering is not required
        return true;
      });
  }

  private _getHolidays(year: number): HebrewCalendar[] {
    const options: CalOptions = {
      year: year,
      isHebrewYear: false,
      candlelighting: true,
      location: Location.lookup('Tel Aviv'),
      sedrot: true,
      omer: true,
    };

    return HebrewCalendar.calendar(options).filter(
      (event: any) =>
        ((event.mask === 21 ||
          event.mask === 8192 ||
          event.mask === 33 ||
          event.mask === 5 ||
          event.mask === 1048578 || // "Erev Shavuot" // "Erev Yom Kippur"
          event.mask === 1048594 || // "Erev Sukkot"
          event.mask === 2097170 || // Half day Pasover
          event.mask === 2097154 || // Half day 'Shmini Atzeret' Shimhat Tora
          event.mask === 16389) &&
          event.linkedEvent != null &&
          event.linkedEvent instanceof HolidayEvent) ||
        event.desc == 'Yom HaZikaron' ||
        event.desc == "Yom HaAtzma'ut"
    );
  }

  public getYearsOptions(currentYear: number): number[] {
    const startYear: number = currentYear - 20;
    const endYear: number = currentYear + 40;

    return Array.from(
      { length: endYear - startYear + 1 },
      (_, index) => startYear + index
    );
  }

  public getView(): Observable<string> {
    return this.view$;
  }

  public getViewValue(): string {
    return this.view$.value;
  }

  public setView(view: string): void {
    this.view$.next(view);
  }

  public getLocale(language: string): string {
    if (language == 'en') {
      return 'en-GB';
    }
    if (language == 'ru') {
      return 'ru-RU';
    }
    if (language == 'he') {
      return 'he';
    }
    return 'en-GB';
  }
}
