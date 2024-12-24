/* eslint-disable ts/no-unsafe-declaration-merging */
import type { DateType, UnitType } from '~/types'
import type { SimpleObject } from '~/types/util-types'
import type { UnitDate, UnitDay, UnitHour, UnitMin, UnitMonth, UnitMs, UnitSecond, UnitWeek, UnitYear } from '~/utils'
import { prettyUnit } from '~/utils'
import { getUnitInDate, setUnitInDate } from '~/utils/date-fields'
import { esday } from '.'
import * as C from './constant'
import { addImpl } from './Impl/add'
import { formatImpl } from './Impl/format'
import { startOfImpl } from './Impl/startOf'
import { parseDate } from './parseDate'

export declare interface EsDay {
  year: (() => number) & ((year: number, month?: number, date?: number) => EsDay)
  month: (() => number) & ((month: number, date?: number) => EsDay)
  date: (() => number) & ((date: number) => EsDay)
  day: (() => number) & ((day: number) => EsDay)
  hour: (() => number) & ((hours: number, min?: number, sec?: number, ms?: number) => EsDay)
  minute: (() => number) & ((min: number, sec?: number, ms?: number) => EsDay)
  second: (() => number) & ((sec: number, ms?: number) => EsDay)
  millisecond: (() => number) & ((ms: number) => EsDay)
}

export class EsDay {
  private $d!: Date
  /**
   * mainly for plugin compatibility
   * store data such as locale name, utc mode, etc.
   */
  private $conf: SimpleObject = {}
  constructor(d: Exclude<DateType, EsDay>, ...others: any[]) {
    this.parse(d, ...others)
  }

  private parse(d: Exclude<DateType, EsDay>, ..._others: any[]) {
    this.$d = parseDate(d)
  }

  // return utc instance
  utc() {
    return new EsDay(this.toDate(), true)
  }

  isSame(that: DateType, units: UnitType = C.MS) {
    const other = esday(that)
    return this.startOf(units) <= other && other <= this.endOf(units)
  }

  isAfter(that: DateType, units: UnitType = C.MS) {
    return esday(that) < this.startOf(units)
  }

  isBefore(that: DateType, units: UnitType = C.MS) {
    return this.endOf(units) < esday(that)
  }

  // return this milliseconds
  valueOf() {
    // timezone(hour) * 60 * 60 * 1000 => ms
    return this.$d.getTime()
  }

  unix() {
    return Math.floor(this.valueOf() / 1000)
  }

  isValid() {
    return !(this.$d.toString() === C.INVALID_DATE_STRING)
  }

  clone() {
    const newInst = new EsDay(this.toDate())
    newInst.$conf = { ...this.$conf }
    return newInst
  }

  format(formatStr?: string) {
    return formatImpl(this, formatStr)
  }

  startOf(units: UnitType) {
    return startOfImpl(this, units)
  }

  endOf(units: UnitType) {
    return startOfImpl(this, units, true)
  }

  add(number: number, units: UnitType) {
    return addImpl(this, number, units)
  }

  subtract(number: number, units: UnitType) {
    return this.add(-number, units)
  }

  get(units: Exclude<UnitType, 'week' | 'w'>) {
    return getUnitInDate(this.$d, units)
  }

  set(unit: UnitYear, year: number, month?: number, date?: number): EsDay
  set(unit: UnitMonth, month: number, date?: number): EsDay
  set(unit: UnitDate, date: number): EsDay
  set(unit: UnitDay, day: number): EsDay
  set(unit: UnitHour, hours: number, min?: number, sec?: number, ms?: number): EsDay
  set(unit: UnitMin, min: number, sec?: number, ms?: number): EsDay
  set(unit: UnitSecond, sec: number, ms?: number): EsDay
  set(unit: UnitMs, ms: number): EsDay
  set(unit: Exclude<UnitType, 'week' | 'w'>, ...values: number[]) {
    return this.clone().$set(unit, values)
  }

  toDate() {
    return new Date(this.valueOf())
  }

  toJSON() {
    return this.isValid() ? this.toISOString() : null
  }

  toISOString() {
    // ie 8 return
    // new Dayjs(this.valueOf() + this.$d.getTimezoneOffset() * 60000)
    // .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    return this.$d.toISOString()
  }

  toString() {
    return this.$d.toUTCString()
  }

  private $set(unit: Exclude<UnitType, UnitWeek>, values: number[]) {
    if (prettyUnit(unit) === C.DAY) {
      setUnitInDate(this.$d, C.DATE, this.date() + (values[0] - this.day()))
    }
    else {
      setUnitInDate(this.$d, unit as Exclude<typeof unit, UnitDay>, values)
    }

    return this
  }
}

const helperNames = ['year', 'month', 'date', 'day', 'hour', 'minute', 'second', 'millisecond'] as const

helperNames.forEach((key) => {
  // @ts-expect-error it's compatible with the overload
  EsDay.prototype[key] = function (...args: number[]): EsDay | number {
    if (args?.length) {
      // @ts-expect-error it's compatible with the overload
      return this.set(key, ...args as [number])
    }
    else {
      return this.get(key)
    }
  }
})
