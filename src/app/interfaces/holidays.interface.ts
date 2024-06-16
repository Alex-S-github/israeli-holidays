export interface IHolidays {
  date: Date;
  name: string;
  isWeekdays: boolean;
  isHalfDay?: boolean;
}

export interface IGroupedHolidays {
  month: string;
  holidays: IHolidays[];
}
