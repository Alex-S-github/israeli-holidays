import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HolidaysService } from '../service/holidays.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalStorageWrapperService } from '../service/local-storage-wrapper.service';
import { MatMenuModule } from '@angular/material/menu';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let holidaysService: HolidaysService;
  let localStorageWrapperService: LocalStorageWrapperService;
  let translateService: TranslateService;
  let dateAdapter: DateAdapter<Date>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SidenavComponent,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatSidenav,
        MatMenuModule,
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

    fixture = TestBed.createComponent(SidenavComponent);
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

  it('should toggle view to "Year" and toggle sidenav', () => {
    const sidenav = jasmine.createSpyObj('MatSidenav', ['toggle']);
    component.toggleView(sidenav, 'Year');
    const sidenavValue = holidaysService.getViewValue();
    expect(sidenavValue).toBe('Year');
    holidaysService.getView().subscribe((value) => {
      expect(value).toBe('Year');
    });
    expect(sidenav.toggle).toHaveBeenCalled();
  });

  it('should toggle view to "Table" and toggle sidenav', () => {
    const sidenav = jasmine.createSpyObj('MatSidenav', ['toggle']);
    component.toggleView(sidenav, 'Table');
    const sidenavValue = holidaysService.getViewValue();
    expect(sidenavValue).toBe('Table');
    holidaysService.getView().subscribe((value) => {
      expect(value).toBe('Table');
    });
    expect(sidenav.toggle).toHaveBeenCalled();
  });

  it('should set default language and use the language if it is stored in localStorage', () => {
    const language = 'ru';
    const expectedLocale = 'ru-RU';
    const sidenav = jasmine.createSpyObj('MatSidenav', ['toggle']);
    spyOn(translateService, 'use');
    spyOn(localStorageWrapperService, 'getItem');
    spyOn(holidaysService, 'getLocale').and.returnValue(expectedLocale);
    fixture.detectChanges();
    component.language = language;
    component.switchLanguage(language, sidenav);
    expect(translateService.use).toHaveBeenCalledWith(language);
    expect(sidenav.toggle).toHaveBeenCalled();
  });

  it('should switch language and toggle sidenav if provided', () => {
    const language = 'ru';
    const expectedLocale = 'ru-RU';
    const sidenav = jasmine.createSpyObj('MatSidenav', ['toggle']);
    spyOn(translateService, 'use');
    spyOn(localStorageWrapperService, 'setItem');
    spyOn(holidaysService, 'getLocale').and.returnValue(expectedLocale);
    component.switchLanguage(language, sidenav);
    expect(translateService.use).toHaveBeenCalledWith(language);
    expect(localStorageWrapperService.setItem).toHaveBeenCalledWith(
      'language',
      language
    );
    expect(sidenav.toggle).toHaveBeenCalled();
  });

  it('should switch language without toggling sidenav if not provided', () => {
    const language = 'en';
    const expectedLocale = 'en-GB';
    spyOn(translateService, 'use');
    spyOn(localStorageWrapperService, 'setItem');
    spyOn(holidaysService, 'getLocale').and.returnValue(expectedLocale);
    component.switchLanguage(language);
    expect(translateService.use).toHaveBeenCalledWith(language);
    expect(localStorageWrapperService.setItem).toHaveBeenCalledWith(
      'language',
      language
    );
  });

  it('should return the parsed value if the item is in localStorage', () => {
    const key = 'testKey';
    const testValue = { someProperty: 'someValue' };
    localStorage.setItem(key, JSON.stringify(testValue));
    const result = localStorageWrapperService.getItem<typeof testValue>(key);
    expect(result).toEqual(testValue);
  });

  it('should return null if the item is not in localStorage', () => {
    const key = 'nonExistentKey';
    const result = localStorageWrapperService.getItem<any>(key);
    expect(result).toBeNull();
  });

  it('should handle JSON parse errors gracefully', () => {
    const key = 'malformedKey';
    localStorage.setItem(key, '{ malformedJson ');
    let result: any;
    expect(
      () => (result = localStorageWrapperService.getItem<any>(key))
    ).toThrow();
  });
});
