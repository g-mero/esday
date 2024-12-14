/* eslint-disable ts/no-unsafe-declaration-merging */
import type { DateType, UnitType } from '~/types'
import { esday } from '.'
import * as C from './constant'
import { addImpl } from './Impl/add'
import { formatImpl } from './Impl/format'
import { startOfImpl } from './Impl/startOf'
import { parseDate } from './parseDate'
import { callDateGetOrSet, getAllFieldsInDate, prettyUnit } from './utils'
import { MS } from './constant';

export declare interface EsDay {
  year: (() => number) & ((value: number) => EsDay)
  month: (() => number) & ((value: number) => EsDay)
  date: (() => number) & ((value: number) => EsDay)
  day: (() => number) & ((value: number) => EsDay)
  hour: (() => number) & ((value: number) => EsDay)
  minute: (() => number) & ((value: number) => EsDay)
  second: (() => number) & ((value: number) => EsDay)
  millisecond: (() => number) & ((value: number) => EsDay)
}

export class EsDay {
  private $d!: Date
  // utc mode
  private $u = false
  constructor(d: Exclude<DateType, EsDay>, utc: boolean, ...others: any[]) {
    this.parse(d, utc, ...others)
  }

  private parse(d: Exclude<DateType, EsDay>, utc: boolean, ..._others: any[]) {
    this.$d = parseDate(d)
    this.$u = utc
  }

  // return utc instance
  utc() {
    return new EsDay(this.toDate(), true)
  }

  isSame(that?: DateType, units: UnitType = MS) {
    const other = esday(that)
    return this.startOf(units) <= other && other <= this.endOf(units)
  }

  isAfter(that?: DateType, units: UnitType = MS) {
    return esday(that) < this.startOf(units)
  }

  isBefore(that?: DateType, units: UnitType = MS) {
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
    return new EsDay(this.toDate(), this.$u)
  }

  format(formatStr: string) {
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
    return getAllFieldsInDate(this.$d, this.$u)[prettyUnit(units)]
  }

  set(units: UnitType, value: number) {
    return this.clone().$set(units, value)
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

  private $set(units: UnitType, value: number) {
    const unit = prettyUnit(units) as string
    const name = {
      [C.D]: `Date`,
      [C.DATE]: `Date`,
      [C.M]: `Month`,
      [C.Y]: `FullYear`,
      [C.H]: `Hours`,
      [C.MIN]: `Minutes`,
      [C.S]: `Seconds`,
      [C.MS]: `Milliseconds`,
    }[unit]
    const arg = unit === C.D ? this.get('date') + (value - this.get('day')) : value

    callDateGetOrSet(this.$d, name as any, this.$u, arg)

    return this
  }
}

['year', 'month', 'date', 'day', 'hour', 'minute', 'second', 'millisecond'].forEach((key) => {
  // @ts-expect-error key is string
  EsDay.prototype[key] = function (value?: number) {
    if (value !== undefined) {
      return this.set(key as UnitType, value)
    }
    else {
      return this.get(key as 'day')
    }
  }
})
