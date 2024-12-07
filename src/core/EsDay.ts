/* eslint-disable ts/no-unsafe-declaration-merging */
import type { DateType, UnitType } from '~/types'
import { esday } from '.'
import * as C from './constant'
import { startOf } from './funcs/startOf'
import { addImpl } from './Impl/add'
import { formatImpl } from './Impl/format'
import { callDateGetOrSet, getAllFieldsInDate, prettyUnit } from './utils'

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
  private $d: Date
  // utc mode
  private $u = false
  constructor(cfg: { d: Date, utc: boolean }) {
    this.$d = cfg.d
    this.$u = cfg.utc
  }

  // return utc instance
  utc() {
    return new EsDay({
      d: this.toDate(),
      utc: true,
    })
  }

  isSame(that: DateType, units: UnitType) {
    const other = esday(that)
    return this.startOf(units) <= other && other <= this.endOf(units)
  }

  isAfter(that: DateType, units: UnitType) {
    return esday(that) < this.startOf(units)
  }

  isBefore(that: DateType, units: UnitType) {
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
    return new EsDay({
      d: new Date(this.$d),
      utc: this.$u,
    })
  }

  format(formatStr: string) {
    return formatImpl(this, formatStr)
  }

  startOf(units: UnitType) {
    const newInst = this.clone()
    startOf(newInst.$d, units, newInst.$u)
    return newInst
  }

  endOf(units: UnitType) {
    const newInst = this.clone()
    startOf(newInst.$d, units, newInst.$u, true)
    return newInst
  }

  add(number: number, units: UnitType) {
    return addImpl(this, number, units)
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
