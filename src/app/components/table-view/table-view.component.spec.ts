import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableViewComponent } from './table-view.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HolidaysService } from '../../service/holidays.service';
import { of } from 'rxjs';

describe('TableViewComponent', () => {
  let component: TableViewComponent;
  let fixture: ComponentFixture<TableViewComponent>;
  let holidaysService: jasmine.SpyObj<HolidaysService>;
  let translateService: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    holidaysService = jasmine.createSpyObj('HolidaysService', [
      'getDataSource',
    ]);
    translateService = jasmine.createSpyObj('TranslateService', ['instant']);
    await TestBed.configureTestingModule({
      imports: [TableViewComponent, TranslateModule.forRoot()],
      providers: [HolidaysService, TranslateService],
    }).compileComponents();

    fixture = TestBed.createComponent(TableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have displayed columns defined', () => {
    expect(component.displayedColumns).toEqual(['day', 'name']);
  });
});
