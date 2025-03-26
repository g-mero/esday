import type { SimpleType } from './util-types'
import type { EsDay } from '~/core'

export type EsDayFactoryParserFn = (d?: DateType, ...others: (SimpleType | string[] | { [key: string]: SimpleType })[]) => EsDay
export interface EsDayFactory {
  (...args: Parameters<EsDayFactoryParserFn>): ReturnType<EsDayFactoryParserFn>
  extend: <T extends {}>(plugin: EsDayPlugin<T>, option?: T) => EsDayFactory
}
export type EsDayPlugin<T extends {} = {}> = (option: T, esdayClass: typeof EsDay, esday: EsDayFactory) => void
export type DateType = EsDay | Date | string | number | number[] | null | undefined | object

// Signature of internal function that creates a Date from date components
export type DateFromDateComponents = (Y: number | undefined, M: number | undefined, D: number | undefined, h: number | undefined, m: number | undefined, s: number | undefined, ms: number | undefined, offsetMs?: number) => Date
