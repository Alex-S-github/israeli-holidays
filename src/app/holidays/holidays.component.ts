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
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

import { HolidaysService } from '../service/holidays.service';
import { IHolidays } from '../interfaces/holidays.interface';

import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
@Component({
  selector: 'app-holidays',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    MatIconModule,
    RouterOutlet,
    RouterModule,
    MatCardModule,
    MatDatepickerModule,
    MatTabsModule,
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
  groupedHolidays: any[] = [];

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
    if (view != 'month') {
      return '';
    }
    if (this.holidays.includes(cellDate.toDateString())) {
      if (cellDate.getDay() !== 5 && cellDate.getDay() !== 6) {
        return 'holliday';
      } else {
        return 'holliday-on-weekend';
      }
    }
    if (cellDate.getDay() == 5 || cellDate.getDay() == 6) {
      return 'weekend';
    }

    return '';
  };

  public getGroupedHolidays(data: IHolidays[]) {
    const groupedByMonth = data.reduce((acc: any, item: any) => {
      const monthName = this.getMonthName(item.date);
      if (!acc[monthName]) {
        acc[monthName] = [];
      }
      acc[monthName].push(item);
      return acc;
    }, {});

    const month = Object.keys(groupedByMonth).map((month) => ({
      month: month,
      dates: groupedByMonth[month],
    }));

    return month;
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
