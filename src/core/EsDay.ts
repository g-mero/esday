/* eslint-disable ts/no-unsafe-declaration-merging */
import type {
  UnitDate,
  UnitDay,
  UnitHour,
  UnitMin,
  UnitMonth,
  UnitMs,
  UnitSecond,
  UnitWeek,
  UnitYear,
} from '~/common'
import { C, isEmptyObject, isUndefined, isValidDate, prettyUnit } from '~/common'
import { getUnitInDate, prettyUnits, setUnitInDate } from '~/common/date-fields'
import type { DateType, UnitType } from '~/types'
import type { SimpleObject } from '~/types/util-types'
import { esday } from '.'
import { addImpl } from './Impl/add'
import { formatImpl } from './Impl/format'
import { parseArrayToDate } from './Impl/parse'
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
  protected $d!: Date
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
    this.$d = this.$parseImpl(d)
  }

  /**
   * Create a Date object from the date components (year, month, ...).
   * Potential hook for plugins to change the details of Date creation.
   * @param Y - year of date to create
   * @param M - year of date to create
   * @param D - year of date to create
   * @param h - year of date to create
   * @param m - year of date to create
   * @param s - year of date to create
   * @param ms - year of date to create
   * @param offsetMs - offset from utc in milliseconds
   * @returns Date object created from input parameters
   */
  protected dateFromDateComponents(
    Y: number | undefined,
    M: number | undefined,
    D: number | undefined,
    h: number | undefined,
    m: number | undefined,
    s: number | undefined,
    ms: number | undefined,
    offsetMs?: number,
  ) {
    const parsedYearOrDefault = Y === undefined ? new Date().getFullYear() : Y
    const dateComponents = {
      Y: parsedYearOrDefault,
      M: (M || 1) - 1,
      D: D || 1,
      h: h || 0,
      m: m || 0,
      s: s || 0,
      ms: ms || 0,
    }

    const yearWithoutCentury = Math.abs(parsedYearOrDefault) < 100
    let overflowed = false
    let result = new Date(
      dateComponents.Y,
      dateComponents.M,
      dateComponents.D,
      dateComponents.h,
      dateComponents.m,
      dateComponents.s,
      dateComponents.ms,
    )

    // Account for single digit years
    if (yearWithoutCentury) {
      result.setFullYear(dateComponents.Y)
    }

    overflowed =
      (M !== undefined && M - 1 !== result.getMonth()) ||
      (D !== undefined && D !== result.getDate()) ||
      (h !== undefined && h !== result.getHours()) ||
      (m !== undefined && m !== result.getMinutes()) ||
      (s !== undefined && s !== result.getSeconds())

    if (overflowed) {
      result = C.INVALID_DATE
    } else {
      if (!isUndefined(offsetMs)) {
        const currentOffsetMin = result.getTimezoneOffset()
        const newMs = result.getMilliseconds() - (currentOffsetMin * 60000 + offsetMs)
        result.setMilliseconds(newMs)
      }
    }

    return result
  }

  /**
   * Convert a parsed element to a number | undefined;
   * empty strings are treated as undefined.
   * @param parsedElement - element to be converted
   * @returns parsed element as number
   */
  private $toNumber(parsedElement: string | number | undefined) {
    if (
      parsedElement === undefined ||
      (typeof parsedElement === 'string' && parsedElement.trim().length === 0)
    ) {
      return undefined
    }

    return Number(parsedElement)
  }

  /**
   * Convert a parsed milliseconds element to a number | undefined;
   * for milliseconds only the 1st 3 digits are considered;
   * empty strings are treated as undefined.
   * @param parsedElement - element to be converted
   * @returns parsed element as number
   */
  private $toMsNumber(parsedElement: string | number | undefined) {
    if (parsedElement === undefined) {
      return undefined
    }

    if (typeof parsedElement === 'string') {
      if (parsedElement.trim().length !== 0) {
        return Number(parsedElement.slice(0, 3))
      }

      return undefined
    }

    return parsedElement
  }

  private $parseImpl(date?: Exclude<DateType, EsDay>): Date {
    if (date instanceof Date) return new Date(date)
    if (date === null) return new Date(Number.NaN)
    if (isUndefined(date)) return new Date()
    if (isEmptyObject(date)) return new Date()
    if (Array.isArray(date)) return parseArrayToDate(date)
    if (typeof date === 'string' && !/Z$/i.test(date)) {
      const d = date.match(C.REGEX_PARSE_DEFAULT)
      if (d) {
        const Y = this.$toNumber(d[1])
        const M = this.$toNumber(d[2])
        const D = this.$toNumber(d[3])
        const h = this.$toNumber(d[4])
        const m = this.$toNumber(d[5])
        const s = this.$toNumber(d[6])
        const ms = this.$toMsNumber(d[7])
        return this.dateFromDateComponents(Y, M, D, h, m, s, ms)
      }
    }

    return new Date(date)
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
    return isValidDate(this.$d)
  }

  clone() {
    const newInst = new EsDay(this.$d)
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
    if (this.isValid()) {
      return this.$d.toISOString()
    }

    return C.INVALID_DATE_STRING
  }

  toString() {
    return this.$d.toUTCString()
  }

  private $set(unit: Exclude<UnitType, UnitWeek>, values: number[]) {
    if (prettyUnit(unit) === C.DAY) {
      setUnitInDate(this.$d, C.DATE, this.date() + (values[0] - this.day()))
    } else {
      setUnitInDate(this.$d, unit as Exclude<typeof unit, UnitDay>, values)
    }

    return this
  }
}

for (const key of prettyUnits) {
  // @ts-expect-error it's compatible with the overload
  EsDay.prototype[key] = function (...args: number[]): EsDay | number {
    if (args?.length) {
      // @ts-expect-error it's compatible with the overload
      return this.set(key, ...(args as [number]))
    }
    return this.get(key)
  }
}
