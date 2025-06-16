import type { EsDay } from '~/core'
import type { SimpleType } from './util-types'

export type EsDayFactoryParserFn = (
  d?: DateType,
  ...others: (SimpleType | string[] | { [key: string]: SimpleType })[]
) => EsDay
export interface EsDayFactory {
  (...args: Parameters<EsDayFactoryParserFn>): ReturnType<EsDayFactoryParserFn>
  extend: <T extends {}>(plugin: EsDayPlugin<T>, option?: T) => EsDayFactory
  addFormatTokenDefinitions: (newTokens: FormattingTokenDefinitions) => void
}
export type EsDayPlugin<T extends {} = {}> = (
  option: Partial<T>,
  esdayClass: typeof EsDay,
  esday: EsDayFactory,
) => void
export type DateType = EsDay | Date | string | number | number[] | null | undefined | object

// Signature of internal function that creates a Date from date components
export type DateFromDateComponents = (
  Y: number | undefined,
  M: number | undefined,
  D: number | undefined,
  h: number | undefined,
  m: number | undefined,
  s: number | undefined,
  ms: number | undefined,
  offsetMs?: number,
) => Date

// Types for for formatting
export type FormattingTokenDefinitions = Record<
  string,
  (sourceDate: EsDay, formatStr?: string) => string
>

// Types for using  multiple values in add, subtract
export type UnitsObjectType = {
  years?: number
  quarters?: number
  months?: number
  weeks?: number
  days?: number
  hours?: number
  mins?: number
  seconds?: number
  milliseconds?: number
}

// Types for using  multiple values in set
export type UnitsObjectTypeSet = {
  year?: number
  quarter?: number
  month?: number
  week?: number
  day?: number // day-of-week
  date?: number // day-of-month
  hour?: number
  min?: number
  second?: number
  millisecond?: number
}
