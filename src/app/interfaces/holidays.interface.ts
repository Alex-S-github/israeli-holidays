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
export interface State {
  flag: string;
  name: string;
  language: string;
}
