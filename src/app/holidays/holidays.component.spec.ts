import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { HolidaysComponent } from './holidays.component';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { HolidaysService } from '../service/holidays.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IHolidays } from '../interfaces/holidays.interface';

describe('HolidaysComponent', () => {
  let component: HolidaysComponent;
  let fixture: ComponentFixture<HolidaysComponent>;
  let holidaysService: HolidaysService;

  let mockHolidays = [
    'Tue Apr 23 2024',
    'Mon Apr 29 2024',
    'Tue May 14 2024',
    'Wed Jun 12 2024',
    'Thu Oct 03 2024',
    'Fri Oct 04 2024',
    'Sat Oct 12 2024',
    'Thu Oct 17 2024',
    'Thu Oct 24 2024',
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HolidaysComponent,
        ReactiveFormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
      providers: [HolidaysService, provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(HolidaysComponent);
    component = fixture.componentInstance;
    holidaysService = TestBed.inject(HolidaysService);

    fixture.detectChanges();
  });

  afterEach(() => {
    if (component.subscription$) {
      component.subscription$.unsubscribe();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize with current year and weekday filter', () => {
    expect(component.form.controls.year.value).toBe(component.currentYear);
    expect(component.form.controls.onlyWeekdays.value).toBeTrue();
  });

  it('should fetch holidays on initialization', () => {
    const holidays: IHolidays[] = holidaysService.getHolidays(
      component.currentYear,
      true
    );
    expect(component.dataSource.data).toEqual(holidays);
  });

  it('should populate year options', () => {
    expect(component.years.length).toEqual(61);
    expect(component.years[0]).toEqual(component.currentYear - 20);
    expect(component.years[component.years.length - 1]).toEqual(
      component.currentYear + 40
    );
  });

  it('should update holidays on form value changes', () => {
    spyOn(holidaysService, 'getHolidays').and.callThrough();
    component.form.controls.year.setValue(2024);
    component.form.controls.onlyWeekdays.setValue(true);

    expect(component.form.controls.year.value).toEqual(2024);

    if (component.form.controls.year.value) {
      const holidays: IHolidays[] = holidaysService.getHolidays(
        component.form.controls.year.value,
        component.form.controls.onlyWeekdays.value
      );
      expect(holidaysService.getHolidays).toHaveBeenCalledWith(2024, true);
      expect(holidays.length).toEqual(14);
    }

    component.form.controls.year.setValue(2023);
    component.form.controls.onlyWeekdays.setValue(false);
    if (component.form.controls.year.value) {
      const holidays: IHolidays[] = holidaysService.getHolidays(
        component.form.controls.year.value,
        component.form.controls.onlyWeekdays.value
      );
      expect(holidays.length).toEqual(17);
      expect(holidaysService.getHolidays).toHaveBeenCalledWith(2023, false);
    }

    fixture.detectChanges();
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component.subscription$, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription$.unsubscribe).toHaveBeenCalled();
  });

  it('should initialize the form and subscribe to value changes', fakeAsync(() => {
    const setDataSourseSpy = spyOn(component, 'setDataView');
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(500);
    expect(setDataSourseSpy).toHaveBeenCalledTimes(1);
  }));

  it('should not call setDataSourse if year is not provided', fakeAsync(() => {
    const setDataSourseSpy = spyOn(component, 'setDataView');
    component.form.patchValue({ year: null, onlyWeekdays: false });
    tick(500);
    expect(setDataSourseSpy).not.toHaveBeenCalled();
  }));

  it('should debounce and distinct value changes', fakeAsync(() => {
    const setDataSourseSpy = spyOn(component, 'setDataView');
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(250);
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(500);
    expect(setDataSourseSpy).toHaveBeenCalledTimes(1);
  }));

  it('should not call setDataSourse if form values have not changed', fakeAsync(() => {
    const setDataSourseSpy = spyOn(component, 'setDataView');
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(500);
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(500);
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(500);
    expect(setDataSourseSpy).toHaveBeenCalledTimes(1);
  }));

  it('should have initial view as "Table"', (done) => {
    component.view$.subscribe((view) => {
      expect(view).toBe('Table');
      done();
    });
  });

  it('should toggle view to "Year" and toggle sidenav', () => {
    component.toggleView('Year');
    const viewValue = holidaysService.getViewValue();
    expect(viewValue).toBe('Year');
    holidaysService.getView().subscribe((value) => {
      expect(value).toBe('Year');
    });
  });

  it('should toggle view to "Table" and toggle sidenav', () => {
    component.toggleView('Table');
    const viewValue = holidaysService.getViewValue();
    expect(viewValue).toBe('Table');
    holidaysService.getView().subscribe((value) => {
      expect(value).toBe('Table');
    });
  });

  it('should return an empty string if view is not "month"', () => {
    const cellDate = new Date(2023, 5, 13);
    const view = 'year';
    const result = component.monthCellClass(cellDate, view);
    expect(result).toBe('');
  });

  it('should return "holiday" for holidays that are not weekends', fakeAsync(() => {
    const setDataSourseSpy = spyOn(component, 'setDataView');
    component.form.patchValue({ year: 2024, onlyWeekdays: true });
    tick(500);
    expect(setDataSourseSpy).toHaveBeenCalledTimes(1);
    const cellDate = new Date('Tue Apr 23 2024');
    const view = 'month';
    const result = component.monthCellClass(cellDate, view);
    expect(result).toBe('holliday');
  }));

  it('should return "holiday-on-weekend" for holidays that are weekends', fakeAsync(() => {
    component.form.patchValue({ year: 2024, onlyWeekdays: false });
    tick(600);
    const cellDate = new Date('Fri Oct 04 2024');
    const view = 'month';
    const result = component.monthCellClass(cellDate, view);
    expect(component.dataSource.data.length).toBe(17);
    expect(result).toBe('holliday-on-weekend');
  }));

  it('should return "weekend" for weekends that are not holidays', fakeAsync(() => {
    const cellDate = new Date('Sat Oct 05 2024');
    const view = 'month';
    const result = component.monthCellClass(cellDate, view);
    expect(result).toBe('weekend');
  }));

  it('should return an empty string for non-holiday weekdays', () => {
    const cellDate = new Date(2023, 5, 13);
    const view = 'month';
    const result = component.monthCellClass(cellDate, view);
    expect(result).toBe('');
  });
});
