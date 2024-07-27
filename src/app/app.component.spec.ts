import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideTranslation } from './app.config';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, BrowserAnimationsModule],
      providers: [
        provideAnimations(),
        provideHttpClient(),
        importProvidersFrom(HttpClientModule),
        importProvidersFrom([TranslateModule.forRoot(provideTranslation())]),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'israeli-holidays' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('israeli-holidays');
  });

  it('should render <sidenav-container> element', () => {
    // Create an instance of the AppComponent
    const fixture = TestBed.createComponent(AppComponent);

    // Trigger change detection to update the component's view
    fixture.detectChanges();
    // Query the DOM for the <sidenav-container> element
    const element = fixture.debugElement.query(By.css('sidenav-container'));

    // Assert that the <sidenav-container> element is present in the DOM
    expect(element).toBeTruthy();
  });

  it('should render <app-holidays> element within <sidenav-container>', () => {
    // Create an instance of the AppComponent
    const fixture = TestBed.createComponent(AppComponent);
    // Trigger change detection to update the component's view
    fixture.detectChanges();
    // Query the DOM for the <sidenav-container> element
    const containerElement = fixture.debugElement.query(
      By.css('sidenav-container')
    );

    // Assert that the <sidenav-container> element is present
    expect(containerElement).toBeTruthy();
    // Query within the <sidenav-container> for the <app-holidays> element
    const holidaysElement = containerElement.query(By.css('app-holidays'));
    // Assert that the <app-holidays> element is present within the <sidenav-container>
    expect(holidaysElement).toBeTruthy();
  });
});
