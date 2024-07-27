import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaysComponent } from './holidays.component';
import { HolidaysService } from '../../service/holidays.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';

describe('HolidaysComponent', () => {
  let component: HolidaysComponent;
  let fixture: ComponentFixture<HolidaysComponent>;
  let holidaysService: HolidaysService;
  let translateService: TranslateService;
  let dateAdapter: DateAdapter<Date>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidaysComponent, TranslateModule.forRoot()],
      providers: [
        HolidaysService,
        provideAnimations(),
        provideNativeDateAdapter(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HolidaysComponent);
    component = fixture.componentInstance;
    holidaysService = TestBed.inject(HolidaysService);
    translateService = TestBed.inject(TranslateService);
    dateAdapter = TestBed.inject(DateAdapter);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
