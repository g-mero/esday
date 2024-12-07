import type { EsDay } from '~/core/EsDay'

export type DateType = Date | string | number | EsDay
export type PrettyUnitType = 'date' | 'day' | 'week' | 'month' | 'year'
  | 'hour' | 'minute' | 'second' | 'millisecond'
export type PrettyUnit<T extends UnitType> = T extends 'D' ? 'date' :
  T extends 'w' ? 'week' : T extends 'M' ? 'month' : T extends 'y' ? 'year' :
    T extends 'H' ? 'hour' : T extends 'm' ? 'minute' : T extends 's' ? 'second' : T extends 'ms' ? 'millisecond' : T

export type UnitType = 'y' | 'M' | 'D' | 'w' | 'H' | 'm' | 's' | 'ms' | PrettyUnitType
export interface AllDateFields {
  year: number
  month: number
  /**
   * date in month
   * 1 ~ 31
   */
  date: number
  /**
   * day in week
   * 0 ~ 6
   */
  day: number
  hour: number
  minute: number
  second: number
  millisecond: number
}
export interface EsDayFactory {
  (d?: DateType, conf?: {
    utc?: boolean
  }): EsDay
  extend: <T extends {}>(plugin: EsDayPlugin<T>, option?: T) => EsDayFactory
}
export type EsDayPlugin<T extends {}> = (option: T, dayTsClass: typeof EsDay, esday: EsDayFactory) => void
