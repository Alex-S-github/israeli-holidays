import { AsyncPipe, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription, tap } from 'rxjs';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HolidaysService } from '../../service/holidays.service';
import { LocalStorageWrapperService } from '../../service/local-storage-wrapper.service';

@Component({
  selector: 'app-holidays-header',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './holidays-header.component.html',
  styleUrl: './holidays-header.component.scss',
})
export class HolidaysHeaderComponent implements OnInit, OnDestroy {
  constructor(
    public translate: TranslateService,
    private holidaysService: HolidaysService,
    private localStorageWrapperService: LocalStorageWrapperService
  ) {
    translate.setDefaultLang('en');
  }
  currentYear = new Date().getFullYear();
  years: number[] = this.holidaysService.getYearsOptions(this.currentYear);
  view$ = this.holidaysService.getView();
  days$ = this.holidaysService.getDataLengthSource();

  subscription$!: Subscription;

  form = new FormGroup({
    year: new FormControl(this.currentYear, { nonNullable: true }),
    onlyWeekdays: new FormControl(true, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.subscription$ = this.form.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => {
          return JSON.stringify(prev) === JSON.stringify(curr);
        }),
        tap((form) => {
          if (form.year == undefined || form.onlyWeekdays == undefined) {
            return;
          }
          this.holidaysService.updateFormState(form.year, form.onlyWeekdays);
        })
      )
      .subscribe();
  }

  public toggleView(view: string): void {
    this.holidaysService.setView(view);
    this.localStorageWrapperService.setItem('view', view);
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
