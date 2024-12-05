import type { AllDateFields, PrettyUnit, UnitType } from '~/types'
import { isArray } from 'radash'
import * as C from './constant'

export function prettyUnit<T extends UnitType>(u: T): PrettyUnit<T> {
  const special = {
    M: C.M,
    y: C.Y,
    w: C.W,
    d: C.D,
    D: C.DATE,
    h: C.H,
    m: C.MIN,
    s: C.S,
    ms: C.MS,
    Q: C.Q,
  }
  return (special[u as keyof typeof special] || String(u || '').toLowerCase().replace(/s$/, '')) as PrettyUnit<T>
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

type DateField = 'FullYear' | 'Month' | 'Date' | 'Day' | 'Hours' | 'Minutes' | 'Seconds' | 'Milliseconds'
export function callDateGetOrSet(date: Date, field: DateField, utc: boolean): number
export function callDateGetOrSet(date: Date, field: Exclude<DateField, 'Day'>, utc: boolean, value: number): void
export function callDateGetOrSet(date: Date, field: Exclude<DateField, 'Day'>, utc: boolean, value: number[]): void
export function callDateGetOrSet(date: Date, field: DateField | Exclude<DateField, 'Day'>, utc: boolean, value?: number | number[]): number | void {
  if (!isUndefined(value) && field !== 'Day') {
    date[`set${utc ? 'UTC' : ''}${field}`](...(isArray(value) ? value : [value]) as [number])
    return
  }
  return date[`get${utc ? 'UTC' : ''}${field}`]()
}

export function getAllFieldsInDate(date: Date, utc: boolean): AllDateFields {
  return {
    year: callDateGetOrSet(date, 'FullYear', utc),
    month: callDateGetOrSet(date, 'Month', utc),
    date: callDateGetOrSet(date, 'Date', utc),
    day: callDateGetOrSet(date, 'Day', utc),
    hour: callDateGetOrSet(date, 'Hours', utc),
    minute: callDateGetOrSet(date, 'Minutes', utc),
    second: callDateGetOrSet(date, 'Seconds', utc),
    millisecond: callDateGetOrSet(date, 'Milliseconds', utc),
  }
}
