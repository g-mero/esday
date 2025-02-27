import type { EsDay } from 'esday'

// From https://stackoverflow.com/questions/41139763/how-to-declare-a-fixed-length-array-in-typescript
 type ReadonlyTuple<
   T,
   N extends number,
   R extends readonly T[] = [],
 > = R['length'] extends N ? R : ReadonlyTuple<T, N, readonly [T, ...R]>

declare module 'esday' {
/* get locale object of instance
  interface EsDay {
    $locale: () => Locale
  }
*/

  interface EsDay {
    /**
     * set locale of instance
     */
    locale: (localeName: string) => EsDay
  }

  interface EsDayFactory {
    /**
     * set / get locale globally
     */
    // locale<T extends string | undefined = undefined>(localeName?: T): T extends string ? EsDayFactory : string
    locale: <T extends string | undefined = undefined>(localeName?: T) => T extends string ? EsDayFactory : string

    /**
     * register locale
     */
    registerLocale: (locale: Locale, newName?: string) => EsDayFactory
  }
}

export type DayNames<T = string> = ReadonlyTuple<T, 7>
export type MonthNames<T = string> = ReadonlyTuple<T, 12>
export interface MonthNamesStandaloneFormat<T = MonthNames<string>> {
  format: T // for use as standalone month name
  standalone: T // for use in a format method
  isFormat?: RegExp
}
export interface MonthNamesFunction<T = MonthNames<string>> {
  (esdayInstance: EsDay, format: string): string
  format: T // for use in a format method
  standalone: T // for use as standalone month name
}
export type RelativeTimeElementFunction = (
  timeValue: string | number,
  withoutSuffix: boolean,
  range: string
) => string

type Format =
  | 'LT'
  | 'LTS'
  | 'L'
  | 'LL'
  | 'LLL'
  | 'LLLL'
  | 'l'
  | 'll'
  | 'lll'
  | 'llll'
type Relative =
  | 'future'
  | 'past'
  | 's'
  | 'm'
  | 'mm'
  | 'h'
  | 'hh'
  | 'd'
  | 'dd'
  | 'M'
  | 'MM'
  | 'y'
  | 'yy'

// Type definition of locale (usually a literal object)
export interface Locale {
  /**
   * Name of the locale
   */
  readonly name: string
  /**
   * Array of full day names
   * @example ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
   */
  readonly weekdays: DayNames
  /**
   * Array of short versions of day names
   * @example ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
   */
  readonly weekdaysShort: DayNames
  /**
   * Array of minimal versions of day names
   * @example ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
   */
  readonly weekdaysMin: DayNames
  readonly months: MonthNames | MonthNamesStandaloneFormat | MonthNamesFunction
  readonly monthsShort: MonthNames | MonthNamesStandaloneFormat | MonthNamesFunction
  readonly ordinal: (number: number, period?: 'W') => string
  readonly weekStart: number
  readonly yearStart: number
  readonly formats: Partial<Record<Format, string>>
  readonly relativeTime: Record<Relative, string | RelativeTimeElementFunction>
  readonly meridiem: (hour: number, minute: number, isLowercase: boolean) => string
}
