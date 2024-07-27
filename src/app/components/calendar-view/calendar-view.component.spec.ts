import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { CalendarViewComponent } from './calendar-view.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { HolidaysService } from '../../service/holidays.service';
import { BehaviorSubject } from 'rxjs';
import { IHolidays } from '../../interfaces/holidays.interface';

const mockHolidays: IHolidays[] = [
  {
    name: 'Yom Kippur',
    date: new Date('2024-10-12'),
    isWeekdays: false,
    isHalfDay: false,
  },
  {
    name: 'Rosh Hashana II',
    date: new Date('2024-10-04'),
    isWeekdays: false,
    isHalfDay: false,
  },
  {
    name: 'Pesach I',
    date: new Date('2024-04-23'),
    isWeekdays: true,
    isHalfDay: false,
  },
  {
    name: 'Yom HaZikaron',
    date: new Date('2024-05-13'),
    isWeekdays: true,
    isHalfDay: true,
  },
];

const mockHolidaysSubject = new BehaviorSubject<IHolidays[]>(mockHolidays);

class MockHolidaysService {
  private _dataSource$ = mockHolidaysSubject;

  public getDataSource(): BehaviorSubject<IHolidays[]> {
    return this._dataSource$;
  }
}

describe('CalendarViewComponent', () => {
  let component: CalendarViewComponent;
  let fixture: ComponentFixture<CalendarViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarViewComponent],
      providers: [
        { provide: HolidaysService, useClass: MockHolidaysService },
        provideNativeDateAdapter(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return an empty string if view is not "month"', () => {
    const cellDate = new Date(2023, 5, 13);
    const view = 'year';
    const result = component.monthCellClass(cellDate, view);
    expect(result).toBe('');
  });

  it('should return "holiday" for holidays that are not weekends', fakeAsync(() => {
    const cellDate = new Date('Tue Apr 23 2024');
    const view = 'month';
    const result = component.monthCellClass(cellDate, view);
    expect(result).toBe('holliday');
  }));

  it('should return "holiday-on-weekend" for holidays that are weekends', fakeAsync(() => {
    const holidaysService = TestBed.inject(HolidaysService);
    const component = new CalendarViewComponent(holidaysService);
    const cellDate = new Date('Fri Oct 04 2024');
    const view = 'month';
    const result = component.monthCellClass(cellDate, view);
    expect(result).toBe('holliday-on-weekend');
  }));

  it('should return "half-holliday" for holidays that are weekends', fakeAsync(() => {
    const holidaysService = TestBed.inject(HolidaysService);
    const component = new CalendarViewComponent(holidaysService);
    const cellDate = new Date('2024-05-13');
    const view = 'month';
    const result = component.monthCellClass(cellDate, view);
    expect(result).toBe('half-holliday');
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
