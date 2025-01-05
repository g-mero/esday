import type { SimpleType } from './util-types'
import type { EsDay } from '~/core'

export type EsDayFactoryParserFn = (d?: DateType, ...others: (SimpleType | { [key: string]: SimpleType })[]) => EsDay
export interface EsDayFactory {
  (...args: Parameters<EsDayFactoryParserFn>): ReturnType<EsDayFactoryParserFn>
  extend: <T extends {}>(plugin: EsDayPlugin<T>, option?: T) => EsDayFactory
  defaultVal: ((key: string) => number) & ((key: string, value: number) => void)
}
export type EsDayPlugin<T extends {}> = (option: T, dayTsClass: typeof EsDay, esday: EsDayFactory) => void
export type DateType = EsDay | Date | string | number | number[] | null | undefined | object
