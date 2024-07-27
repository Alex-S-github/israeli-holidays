import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { HolidaysHeaderComponent } from '../holidays-header/holidays-header.component';
import { TableViewComponent } from '../table-view/table-view.component';
import { CalendarViewComponent } from '../calendar-view/calendar-view.component';
import { HolidaysService } from '../../service/holidays.service';
import { shareReplay } from 'rxjs';

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [
    AsyncPipe,
    HolidaysHeaderComponent,
    CalendarViewComponent,
    TableViewComponent,
  ],
  templateUrl: './holidays.component.html',
  styleUrl: './holidays.component.scss',
})
export class HolidaysComponent {
  holidaysService: HolidaysService = inject(HolidaysService);

  view$ = this.holidaysService.getView().pipe(shareReplay(1));
}
