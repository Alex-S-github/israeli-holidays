import { DatePipe, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HolidaysService } from '../../service/holidays.service';
import { TranslateHolidayPipe } from '../../pipes/translate-holiday.pipe';

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [
    NgStyle,
    DatePipe,
    TranslateHolidayPipe,
    MatTableModule,
    TranslateModule,
  ],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.scss',
})
export class TableViewComponent {
  constructor(
    private holidaysService: HolidaysService,
    public translate: TranslateService
  ) {}

  public displayedColumns = ['day', 'name'];

  dataSourse$ = this.holidaysService.getDataSource();
}
