import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'translateHoliday',
  pure: true,
  standalone: true,
})
export class TranslateHolidayPipe implements PipeTransform {
  private translationCache = new Map<string, string>();

  constructor(private translate: TranslateService) {}

  /**
   * Pipe for translating a holiday name. Specially handles "Rosh Hashana" by including the year.
   * Utilizes memoization to cache translated values.
   *
   * @param name The name of the holiday to translate.
   * @returns The translated holiday name. If the holiday is "Rosh Hashana" with a year,
   *          the year is included in the translated name. Otherwise, the holiday name is
   *          translated as is.
   */
  transform(name: string): string {
    if (this.translationCache.has(name)) {
      return this.translationCache.get(name)!;
    }

    const roshHashanaPattern = /^Rosh Hashana (\d+)$/;
    const match = roshHashanaPattern.exec(name);

    let translatedName: string;
    if (match) {
      const holidayName = 'Rosh Hashana';
      const year = match[1];
      translatedName = `${this.translate.instant(
        `HOLIDAY.${holidayName}`
      )} ${year}`;
    } else {
      translatedName = this.translate.instant(`HOLIDAY.${name}`);
    }

    this.translationCache.set(name, translatedName);
    return translatedName;
  }
}
