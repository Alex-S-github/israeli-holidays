import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HolidaysService } from '../service/holidays.service';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let holidaysService: HolidaysService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SidenavComponent,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatSidenav,
      ],
      providers: [HolidaysService, provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    holidaysService = TestBed.inject(HolidaysService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial view as "Table"', (done) => {
    component.currentView$.subscribe((view) => {
      expect(view).toBe('Table');
      done();
    });
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
});
