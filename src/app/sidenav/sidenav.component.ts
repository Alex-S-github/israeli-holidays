import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { ThemePalette } from '@angular/material/core';

import { HolidaysService } from '../service/holidays.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'sidenav-conatiner',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatIconModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  holidaysService: HolidaysService = inject(HolidaysService);
  currentView$: Observable<string> = this.holidaysService.getView();
  color: ThemePalette = 'primary';

  toggleView(sidenav: MatSidenav, view: string): void {
    this.holidaysService.setView(view);
    sidenav.toggle();
  }
}
