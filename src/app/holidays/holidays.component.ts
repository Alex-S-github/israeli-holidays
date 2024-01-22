import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { HolidaysService } from '../service/holidays.service';
import { debounceTime, takeUntil } from 'rxjs';
import { IHolidays } from '../interfaces/holidays.interface';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './holidays.component.html',
  styleUrl: './holidays.component.scss',
})
export class HolidaysComponent implements OnInit {
  constructor(private _formBuilder: FormBuilder) {}

  holidaysService: HolidaysService = inject(HolidaysService);

  currentYear = new Date().getFullYear();
  years: number[] = this.holidaysService.getYearsOptions(this.currentYear);

  form = this._formBuilder.group({
    year: [this.currentYear],
    isWeekdays: false,
  });

  displayedColumns = ['day', 'date', 'name'];
  dataSource = new MatTableDataSource<IHolidays>([]);

  ngOnInit(): void {
    this.initHolidays();
    this.handleHolidays();
  }

  private initHolidays(): void {
    this.setDataSourse(this.holidaysService.getHolidays(this.currentYear));
  }

  handleHolidays(): void {
    this.form.valueChanges.pipe(debounceTime(500)).subscribe((form) => {
      if (!form.year) return;

      let holidays: IHolidays[] = this.holidaysService.getHolidays(form.year);

      if (form.isWeekdays) {
        holidays = holidays.filter((day) => {
          const dayOfWeek = new Date(day.date).getDay();
          return dayOfWeek !== 5 && dayOfWeek !== 6;
        });
      }
      this.setDataSourse(holidays);
    });
  }

  setDataSourse(data: IHolidays[]): void {
    this.dataSource = new MatTableDataSource<IHolidays>(data);
  }

  openDetail(row: IHolidays): void {
    console.log('HolidaysComponent ~ openDetail ~ row:', row);
  }
}
