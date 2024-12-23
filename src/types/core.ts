import type { DateType } from './date'
import type { EsDay } from '~/core'

export type EsDayFactoryParserFn = (d?: DateType, ...others: any[]) => EsDay
export interface EsDayFactory {
  (...args: Parameters<EsDayFactoryParserFn>): ReturnType<EsDayFactoryParserFn>
  utc: EsDayFactoryParserFn
  extend: <T extends {}>(plugin: EsDayPlugin<T>, option?: T) => EsDayFactory
}
export type EsDayPlugin<T extends {}> = (option: T, dayTsClass: typeof EsDay, esday: EsDayFactory) => void
