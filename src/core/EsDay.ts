/* eslint-disable ts/no-unsafe-declaration-merging */
import type { UnitType } from '~/types'
import * as C from './constant'
import { formatDate } from './funcs/formatDate'
import { startOf } from './funcs/startOf'
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
      d: this.$d,
      utc: true,
    })
  }

  // return this milliseconds
  valueOf() {
    // timezone(hour) * 60 * 60 * 1000 => ms
    return this.$d.getTime()
  }

  unix() {
    return Math.floor(this.valueOf() / 1000)
  }

  clone() {
    return new EsDay({
      d: new Date(this.$d),
      utc: this.$u,
    })
  }

  format(formatStr: string) {
    return formatDate(getAllFieldsInDate(this.$d, this.$u), formatStr)
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

  get(units: Exclude<UnitType, 'week' | 'W'>) {
    return getAllFieldsInDate(this.$d, this.$u)[prettyUnit(units)]
  }

  set(units: UnitType, value: number) {
    return this.clone().$set(units, value)
  }

  toDate() {
    return new Date(this.$d)
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
