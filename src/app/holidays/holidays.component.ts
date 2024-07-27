import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

import { HolidaysService } from '../service/holidays.service';
import { IGroupedHolidays, IHolidays } from '../interfaces/holidays.interface';

import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
/**
 * @deprecated This Component is Deprecated.
 */
@Component({
  selector: 'app-holidays',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
  ],
  templateUrl: './holidays.component.html',
  styleUrl: './holidays.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HolidaysComponent implements OnInit, OnDestroy {
  constructor(private _formBuilder: FormBuilder) {}
  subscription$!: Subscription;

  holidaysService: HolidaysService = inject(HolidaysService);
  currentYear = new Date().getFullYear();
  years: number[] = this.holidaysService.getYearsOptions(this.currentYear);

  view$ = this.holidaysService.getView();

  form = this._formBuilder.group({
    year: this.currentYear,
    onlyWeekdays: true,
  });

  protected displayedColumns = ['day', 'name'];
  dataSource = new MatTableDataSource<IHolidays>([]);

  holidays: string[] = [];
  groupedHolidays: IGroupedHolidays[] = [];

  ngOnInit(): void {
    this.initHolidays();
    this.handleHolidays();
  }

  private initHolidays(): void {
    this.setDataView(
      this.holidaysService.getHolidays(
        this.currentYear,
        this.form.controls.onlyWeekdays.value
      )
    );
  }

  private handleHolidays(): void {
    this.subscription$ = this.form.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged((prev, curr) => {
          return JSON.stringify(prev) === JSON.stringify(curr);
        })
      )
      .subscribe((form) => {
        if (!form.year) return;
        let holidays: IHolidays[] = this.holidaysService.getHolidays(
          form.year,
          form.onlyWeekdays
        );
        this.setDataView(holidays);
      });
  }

  public setDataView(data: IHolidays[]): void {
    this.dataSource = new MatTableDataSource<IHolidays>(data);

    this.groupedHolidays = this.getGroupedHolidays(data);

    this.holidays = data.map((holidays: IHolidays) => {
      return holidays.date.toDateString();
    });
  }

  public toggleView(view: string): void {
    this.holidaysService.setView(view);
  }

  monthCellClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view !== 'month') {
      return '';
    }

    const dateStr = cellDate.toDateString();
    const day = cellDate.getDay();
    const holiday: IHolidays | undefined = [...this.dataSource.data].find(
      (h: IHolidays) => h.date.toDateString() === dateStr
    );

    if (day == 5 || day == 6) {
      if (holiday) {
        if (holiday.isWeekdays === false) {
          return 'holliday-on-weekend';
        }
      }
      return 'weekend';
    } else {
      if (holiday) {
        if (holiday.isHalfDay) {
          return 'half-holliday';
        } else {
          return 'holliday';
        }
      }
    }
    return '';
  };

  public getGroupedHolidays(data: IHolidays[]): IGroupedHolidays[] {
    const groupedByMonth = data.reduce((acc: any, item: any) => {
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

  private getMonthName(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long' });
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
