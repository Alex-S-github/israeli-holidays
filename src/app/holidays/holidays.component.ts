import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

import { HolidaysService } from '../service/holidays.service';
import { IHolidays } from '../interfaces/holidays.interface';

@Component({
  selector: 'app-holidays',
  standalone: true,
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
  ],
  templateUrl: './holidays.component.html',
  styleUrl: './holidays.component.scss',
})
export class HolidaysComponent implements OnInit {
  constructor(private _formBuilder: FormBuilder) {}
  subscription$!: Subscription;

  holidaysService: HolidaysService = inject(HolidaysService);
  currentYear = new Date().getFullYear();
  years: number[] = this.holidaysService.getYearsOptions(this.currentYear);

  form = this._formBuilder.group({
    year: this.currentYear,
    onlyWeekdays: true,
  });

  displayedColumns = ['day', 'name'];
  dataSource = new MatTableDataSource<IHolidays>([]);

  ngOnInit(): void {
    this.initHolidays();
    this.handleHolidays();
  }

  private initHolidays(): void {
    this.setDataSourse(
      this.holidaysService.getHolidays(
        this.currentYear,
        this.form.controls.onlyWeekdays.value
      )
    );
  }

  handleHolidays(): void {
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
        this.setDataSourse(holidays);
      });
  }

  setDataSourse(data: IHolidays[]): void {
    this.dataSource = new MatTableDataSource<IHolidays>(data);
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
