import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import {
  DateAdapter,
  provideNativeDateAdapter,
  ThemePalette,
} from '@angular/material/core';

import { HolidaysService } from '../service/holidays.service';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalStorageWrapperService } from '../service/local-storage-wrapper.service';
import { State } from '../interfaces/holidays.interface';

@Component({
  selector: 'sidenav-container',
  standalone: true,
  imports: [
    NgClass,
    AsyncPipe,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    TranslateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  currentView$: Observable<string> = this.holidaysService.getView();
  color: ThemePalette = 'primary';

  states: State[] = [
    { name: 'עברית', flag: 'assets/Flag_Israel.svg', language: 'he' },
    { name: 'Русский', flag: 'assets/Flag_Russia.svg', language: 'ru' },
    { name: 'English', flag: 'assets/Flag_United_Kingdom.svg', language: 'en' },
  ];

  language: string | null = this.localStorageWrapperService.getItem('language');

  constructor(
    private holidaysService: HolidaysService,
    private localStorageWrapperService: LocalStorageWrapperService,
    public translate: TranslateService,
    private adapter: DateAdapter<Date>
  ) {
    if (this.language) {
      this.translate.setDefaultLang(this.language);
      this.translate.use(this.language);
    }

    this.adapter.setLocale(this.language);
  }

  public toggleView(sidenav: MatSidenav, view: string): void {
    this.holidaysService.setView(view);
    this.localStorageWrapperService.setItem('view', view);
    sidenav.toggle();
  }

  public switchLanguage(language: string, sidenav?: MatSidenav): void {
    this.translate.use(language);
    if (sidenav) {
      sidenav.toggle();
    }

    this.localStorageWrapperService.setItem('language', language);
    this.adapter.setLocale(this.holidaysService.getLocale(language));
  }
}
