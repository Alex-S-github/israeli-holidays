import { Injectable } from '@angular/core';
import { HebrewCalendar, Location, HolidayEvent } from '@hebcal/core';
import { IHolidays } from '../interfaces/holidays.interface';

@Injectable({
  providedIn: 'root',
})
export class HolidaysService {
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
          date: date,
          isWeekdays:
            new Date(date).getDay() !== 5 && new Date(date).getDay() !== 6,
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
    const options = {
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
          event.mask === 16389) &&
          event.linkedEvent != null &&
          event.linkedEvent instanceof HolidayEvent) ||
        event.desc == "Yom HaAtzma'ut"
    );
  }

  getYearsOptions(currentYear: number): number[] {
    const startYear: number = currentYear - 20;
    const endYear: number = currentYear + 40;

    return Array.from(
      { length: endYear - startYear + 1 },
      (_, index) => startYear + index
    );
  }
}
