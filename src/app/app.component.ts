import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HolidaysComponent } from './components/holidays/holidays.component';
import { SidenavComponent } from './sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HolidaysComponent, SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'israeli-holidays';
  // ng build --output-path docs --base-href /israeli-holidays/
  // after build, move all files from 'browser' to 'docs' folder
}
