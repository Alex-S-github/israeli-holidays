import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { HolidaysHeaderComponent } from './holidays-header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HolidaysService } from '../../service/holidays.service';
import { LocalStorageWrapperService } from '../../service/local-storage-wrapper.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('HolidaysHeaderComponent', () => {
  let component: HolidaysHeaderComponent;
  let fixture: ComponentFixture<HolidaysHeaderComponent>;
  let holidaysService: HolidaysService;
  let localStorageWrapperService: LocalStorageWrapperService;
  let translateService: TranslateService;
  let dateAdapter: DateAdapter<Date>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HolidaysHeaderComponent,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        HolidaysService,
        LocalStorageWrapperService,
        TranslateService,
        provideAnimations(),
        provideNativeDateAdapter(),
        {
          provide: DateAdapter,
          useValue: jasmine.createSpyObj('DateAdapter', ['setLocale']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HolidaysHeaderComponent);
    component = fixture.componentInstance;
    holidaysService = TestBed.inject(HolidaysService);
    localStorageWrapperService = TestBed.inject(LocalStorageWrapperService);
    translateService = TestBed.inject(TranslateService);
    dateAdapter = TestBed.inject(DateAdapter);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current year and weekday filter', () => {
    expect(component.form.controls.year.value).toBe(component.currentYear);
    expect(component.form.controls.onlyWeekdays.value).toBeTrue();
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component.subscription$, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription$.unsubscribe).toHaveBeenCalled();
  });

  it('should populate year options', () => {
    expect(component.years.length).toEqual(61);
    expect(component.years[0]).toEqual(component.currentYear - 20);
    expect(component.years[component.years.length - 1]).toEqual(
      component.currentYear + 40
    );
  });

  it('should debounce and distinct value changes', fakeAsync(() => {
    const updateFormStateSpy = spyOn(holidaysService, 'updateFormState');
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(250);
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(500);
    expect(updateFormStateSpy).toHaveBeenCalledTimes(1);
  }));
  it('should not call updateFormState if form values have not changed', fakeAsync(() => {
    const updateFormStateSpy = spyOn(holidaysService, 'updateFormState');
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(500);
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(500);
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(500);
    expect(updateFormStateSpy).toHaveBeenCalledTimes(1);
  }));
  it('should not call updateFormState if year is not provided', fakeAsync(() => {
    const updateFormStateSpy = spyOn(holidaysService, 'updateFormState');
    component.form.patchValue({ year: undefined, onlyWeekdays: undefined });
    tick(500);
    expect(updateFormStateSpy).not.toHaveBeenCalled();
  }));

  it('should toggle view to "Year" and toggle sidenav', () => {
    component.toggleView('Year');
    const viewValue = holidaysService.getViewValue();
    const viewlocalStorage = localStorageWrapperService.getItem('view');
    expect(viewValue).toBe('Year');
    expect(viewlocalStorage).toBe('Year');
    holidaysService.getView().subscribe((value) => {
      expect(value).toBe('Year');
    });
  });

  it('should toggle view to "Table" and toggle sidenav', () => {
    component.toggleView('Table');
    const viewValue = holidaysService.getViewValue();
    const viewlocalStorage = localStorageWrapperService.getItem('view');
    expect(viewValue).toBe('Table');
    expect(viewlocalStorage).toBe('Table');
    holidaysService.getView().subscribe((value) => {
      expect(value).toBe('Table');
    });
  });

  /**
   * Function to run the days off test
   * @param {number} year - The year to test
   * @param {boolean} onlyWeekdays - Flag indicating whether to test only weekdays
   * @param {number} expectedDaysOff - The expected number of days off
   */
  function runDaysOffTest(
    year: number,
    onlyWeekdays: boolean,
    expectedDaysOff: number
  ) {
    it(`should return correct "daysOff" for year ${year} with onlyWeekdays=${onlyWeekdays}`, fakeAsync(() => {
      component.form.patchValue({ year: year, onlyWeekdays: onlyWeekdays });
      tick(500);
      component.days$.subscribe((daysOff: number) => {
        expect(daysOff).toEqual(expectedDaysOff);
      });
    }));
  }
  // Iterate through the mock data and run tests for both onlyWeekdays and allDays
  mockData.forEach(({ year, weekdaysOnly, allDays }) => {
    runDaysOffTest(year, true, weekdaysOnly);
    runDaysOffTest(year, false, allDays);
  });

  it('should toggle view and update local storage', () => {
    spyOn(holidaysService, 'setView');
    spyOn(localStorageWrapperService, 'setItem');

    const view = 'calendar';
    component.toggleView(view);

    expect(holidaysService.setView).toHaveBeenCalledWith(view);
    expect(localStorageWrapperService.setItem).toHaveBeenCalledWith(
      'view',
      view
    );
  });

  it('should toggle view to table and update local storage', () => {
    spyOn(holidaysService, 'setView');
    spyOn(localStorageWrapperService, 'setItem');

    const view = 'table';
    component.toggleView(view);

    expect(holidaysService.setView).toHaveBeenCalledWith(view);
    expect(localStorageWrapperService.setItem).toHaveBeenCalledWith(
      'view',
      view
    );
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component.subscription$, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription$.unsubscribe).toHaveBeenCalled();
  });
});
