import { HolidaysService } from '../../service/holidays.service';
import { Component, ViewEncapsulation } from '@angular/core';
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import {
  IGroupedHolidays,
  IHolidays,
} from '../../interfaces/holidays.interface';
import 'moment/locale/ru';
import 'moment/locale/he';
import { map, Observable } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [JsonPipe, AsyncPipe, MatCardModule, MatDatepickerModule],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CalendarViewComponent {
  protected groupedHolidays$: Observable<IGroupedHolidays[]> =
    this.holidaysService.getDataSource().pipe(
      map((data: IHolidays[]) => {
        return this.getGroupedHolidays(data);
      })
    );
  constructor(private holidaysService: HolidaysService) {}

  public getGroupedHolidays(data: IHolidays[]): IGroupedHolidays[] {
    const groupedByMonth = data.reduce((acc: any, item: IHolidays) => {
      const monthName = this.getMonthName(item.date);
      if (!acc[monthName]) {
        acc[monthName] = [];
      }
      acc[monthName].push(item);
      return acc;
    }, {});
    const groupedHolidays: IGroupedHolidays[] = Object.keys(groupedByMonth).map(
      (month) => ({
        month: month,
        holidays: groupedByMonth[month],
      })
    );
    return groupedHolidays;
  }

  private getMonthName(date: Date): string {
    return date.toLocaleString('default', { month: 'long' });
  }

  monthCellClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view !== 'month') {
      return '';
    }
    const dateStr = cellDate.toDateString();
    const day = cellDate.getDay();

    const holiday: IHolidays | undefined = this.holidaysService
      .getDataSource()
      .value.find((h: IHolidays) => h.date.toDateString() === dateStr);

    if (day == 5 || day == 6) {
      if (holiday?.isWeekdays === false) {
        return 'holliday-on-weekend';
      }
      return 'weekend';
    }
    if (holiday) {
      if (holiday?.isHalfDay) {
        return 'half-holliday';
      } else {
        return 'holliday';
      }
    }
    return '';
  };
}
