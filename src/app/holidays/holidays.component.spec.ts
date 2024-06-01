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
      expect(holidays.length).toEqual(7);
    }

    component.form.controls.year.setValue(2023);
    component.form.controls.onlyWeekdays.setValue(false);
    if (component.form.controls.year.value) {
      const holidays: IHolidays[] = holidaysService.getHolidays(
        component.form.controls.year.value,
        component.form.controls.onlyWeekdays.value
      );
      expect(holidays.length).toEqual(9);
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
    const setDataSourseSpy = spyOn(component, 'setDataSourse');
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(500);
    expect(setDataSourseSpy).toHaveBeenCalledTimes(1);
  }));

  it('should not call setDataSourse if year is not provided', fakeAsync(() => {
    const setDataSourseSpy = spyOn(component, 'setDataSourse');
    component.form.patchValue({ year: null, onlyWeekdays: false });
    tick(500);
    expect(setDataSourseSpy).not.toHaveBeenCalled();
  }));

  it('should debounce and distinct value changes', fakeAsync(() => {
    const setDataSourseSpy = spyOn(component, 'setDataSourse');
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(250);
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(500);
    expect(setDataSourseSpy).toHaveBeenCalledTimes(1);
  }));

  it('should not call setDataSourse if form values have not changed', fakeAsync(() => {
    const setDataSourseSpy = spyOn(component, 'setDataSourse');
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(500);
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(500);
    component.form.patchValue({ year: 2023, onlyWeekdays: false });
    tick(500);
    expect(setDataSourseSpy).toHaveBeenCalledTimes(1);
  }));
});
