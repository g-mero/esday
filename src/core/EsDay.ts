/* eslint-disable ts/no-unsafe-declaration-merging */
import type { UnitDate, UnitDay, UnitHour, UnitMin, UnitMonth, UnitMs, UnitSecond, UnitWeek, UnitYear } from '~/common'
import type { DateType, UnitType } from '~/types'
import type { SimpleObject } from '~/types/util-types'
import { C, defaultVal, prettyUnit } from '~/common'
import { getUnitInDate, setUnitInDate } from '~/common/date-fields'
import { esday } from '.'
import { addImpl } from './Impl/add'
import { formatImpl } from './Impl/format'
import { parseImpl } from './Impl/parse'
import { startOfImpl } from './Impl/startOf'

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
  constructor(d: Exclude<DateType, EsDay>, conf?: SimpleObject) {
    this.$conf = { ...conf }
    this.parse(d)
  }

  private parse(d: Exclude<DateType, EsDay>) {
    this.$d = this.$parseDate(d)
  }

  private $parseDate(d: DateType, utc = false) {
    return parseImpl(d, utc)
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

  utcOffset() {
    // Because a bug at FF24, we're rounding the timezone offset around 15 minutes
    // https://github.com/moment/moment/pull/1871
    return -Math.round(this.$d.getTimezoneOffset() / 15) * 15
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

  get(units: Exclude<UnitType, UnitWeek>) {
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
  set(unit: Exclude<UnitType, UnitWeek>, ...values: number[]) {
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

  private $set(unit: Exclude<UnitType, UnitWeek>, values: number[], utc = false) {
    if (prettyUnit(unit) === C.DAY) {
      setUnitInDate(this.$d, C.DATE, this.date() + (values[0] - this.day()), utc)
    }
    else {
      setUnitInDate(this.$d, unit as Exclude<typeof unit, UnitDay>, values, utc)
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

defaultVal('weekStart', 1)
