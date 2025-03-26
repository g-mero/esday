/* eslint-disable dot-notation */
import type { EsDay } from 'esday'
/**
 * utc plugin
 *
 * when utc mode is enabled, get and set methods will use UTC time
 *
 * new esday parameters in '$conf':
 *   utc              utc mode (true / false)
 *   offset           utcOffset (constant value, no DST handling)
 *   timezoneOffset   timezone offset (with DST handling)
 */

import type { UnitDay } from '~/common'
import type { DateType, EsDayPlugin } from '~/types'
import {
  C,
  getUnitInDate,
  getUnitInDateUTC,
  isUndefined,
  prettyUnit,
  setUnitInDateUTC,
} from '~/common'

const REGEX_VALID_OFFSET_FORMAT = /[+-]\d\d(?::?\d\d)?/g
const REGEX_OFFSET_HOURS_MINUTES_FORMAT = /[+-]|\d\d/g
function offsetFromString(value = '') {
  const offset = value.match(REGEX_VALID_OFFSET_FORMAT)

  if (!offset) {
    return Number.NaN
  }

  const [indicator, hoursOffset, minutesOffset] = `${offset[0]}`.match(
    REGEX_OFFSET_HOURS_MINUTES_FORMAT,
  ) || ['-', 0, 0]
  const totalOffsetInMinutes = +hoursOffset * 60 + +minutesOffset

  if (totalOffsetInMinutes === 0) {
    return 0
  }

  return indicator === '+' ? totalOffsetInMinutes : -totalOffsetInMinutes
}

declare module 'esday' {
  interface EsDay {
    utc: (keepLocalTime?: boolean) => EsDay
    local: () => EsDay
    isUTC: () => boolean
    /* eslint-disable ts/method-signature-style */
    utcOffset(): number
    utcOffset(offset: number | string, keepLocalTime?: boolean): EsDay
    /* eslint-enable ts/method-signature-style */
  }

  interface EsDayFactory {
    utc: (date?: DateType, ...others: any[]) => EsDay
  }
}

const utcPlugin: EsDayPlugin<{}> = (_, dayClass, dayFactory) => {
  // parse a date as utc
  dayFactory.utc = (d?: DateType, ...others: any[]) => {
    const inst = dayFactory(d, ...others, { utc: true })
    return inst
  }

  const proto = dayClass.prototype
  // convert a date to utc
  proto.utc = function (keepLocalTime?: boolean) {
    const inst = this.clone()
    inst['$d'] = this.toDate()
    inst['$conf'].utc = true
    if (keepLocalTime) {
      // TODO maybe the generated time does not exits in the current timezone; see momentjs
      return inst.add(this.utcOffset(), C.MIN)
    }
    return inst
  }

  proto.local = function () {
    const inst = this.clone()
    inst['$conf'].utc = false
    return inst
  }

  proto.isUTC = function () {
    return !!this['$conf'].utc
  }

  proto.toISOString = function () {
    if (this.isValid()) {
      return this.toDate().toISOString()
    }
    return C.INVALID_DATE_STRING
  }

  proto.utcOffset = function (offset?: number | string, keepLocalTime?: boolean): any {
    if (offset === undefined) {
      const defaultOffset = -Math.round(this['$d'].getTimezoneOffset())
      return utcOffsetGetImpl(this, defaultOffset)
    }
    return utcOffsetSetImpl(this, offset, keepLocalTime)
  }

  const oldValueOf = proto.valueOf
  proto.valueOf = function () {
    if (this['$conf'].offset !== undefined) {
      const internalDate = this['$d']
      const offsetToUse = Number(this['$conf'].tzOffset ?? internalDate.getTimezoneOffset())
      const addedOffset = Number(this['$conf'].offset) + offsetToUse
      return internalDate.valueOf() - addedOffset * C.MILLISECONDS_A_MINUTE
    }
    return oldValueOf.call(this)
  }

  const oldFormat = proto.format
  proto.format = function (formatStr) {
    const UTC_FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ss[Z]'
    const str = formatStr || (this['$conf'].utc ? UTC_FORMAT_DEFAULT : '')
    return oldFormat.call(this, str)
  }

  // change private method 'dateFromDateComponents' of EsDay
  const oldDateFromDateComponents = proto['dateFromDateComponents']
  proto['dateFromDateComponents'] = function (
    Y: number | undefined,
    M: number | undefined,
    D: number | undefined,
    h: number | undefined,
    m: number | undefined,
    s: number | undefined,
    ms: number | undefined,
    offsetMs?: number,
  ) {
    if (!this['$conf'].utc) {
      return oldDateFromDateComponents(Y, M, D, h, m, s, ms, offsetMs)
    }

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
    let result: Date
    let overflowed = false

    result = new Date(
      Date.UTC(
        dateComponents.Y,
        dateComponents.M,
        dateComponents.D,
        dateComponents.h,
        dateComponents.m,
        dateComponents.s,
        dateComponents.ms,
      ),
    )

    // Account for single digit years
    if (yearWithoutCentury) {
      result.setUTCFullYear(dateComponents.Y)
    }

    overflowed =
      (M !== undefined && M - 1 !== result.getUTCMonth()) ||
      (D !== undefined && D !== result.getUTCDate()) ||
      (h !== undefined && h !== result.getUTCHours()) ||
      (m !== undefined && m !== result.getUTCMinutes()) ||
      (s !== undefined && s !== result.getUTCSeconds())

    if (overflowed) {
      result = C.INVALID_DATE
    } else {
      if (!isUndefined(offsetMs)) {
        result.setUTCMilliseconds(result.getUTCMilliseconds() - offsetMs)
      }
    }

    return result
  }

  proto.get = function (unit) {
    const utc = !!this['$conf'].utc
    return utc ? getUnitInDateUTC(this['$d'], unit) : getUnitInDate(this['$d'], unit)
  }

  const old$set = proto['$set']
  proto['$set'] = function (unit, values) {
    const utc = !!this['$conf'].utc
    if (utc) {
      const $date = this['$d']
      if (prettyUnit(unit) === C.DAY) {
        setUnitInDateUTC($date, C.DATE, this.date() + (values[0] - this.day()))
      } else {
        setUnitInDateUTC($date, unit as Exclude<typeof unit, UnitDay>, values)
      }

      return this
    }
    return old$set.call(this, unit, values)
  }
}

function utcOffsetGetImpl(that: EsDay, defaultValue = Number.NaN) {
  if (that['$conf'].utc) {
    return 0
  }
  if (that['$conf'].offset !== undefined) {
    return Number(that['$conf'].offset)
  }
  return defaultValue
}

function utcOffsetSetImpl(that: EsDay, offset: number | string, keepLocalTime?: boolean) {
  let offsetAsNumber: number

  if (typeof offset === 'string') {
    offsetAsNumber = offsetFromString(offset)
    if (Number.isNaN(offsetAsNumber)) {
      return that
    }
  } else {
    offsetAsNumber = offset
  }

  const offsetAsMinutes = Math.abs(offsetAsNumber) <= 16 ? offsetAsNumber * 60 : offsetAsNumber

  if (keepLocalTime) {
    // change point in time using offset and return new instance
    const localTimezoneOffset = that['$conf'].utc
      ? that.toDate().getTimezoneOffset()
      : -1 * that.utcOffset()
    const instance = that.add(localTimezoneOffset, C.MIN)
    instance['$conf'].offset = offsetAsMinutes
    instance['$conf'].tzOffset = localTimezoneOffset
    instance['$conf'].utc = offsetAsMinutes === 0
    return instance
  }

  if (offsetAsNumber !== 0) {
    const localTimezoneOffset = that['$conf'].utc
      ? that.toDate().getTimezoneOffset()
      : -1 * that.utcOffset()

    // switch away from utc mode
    const instance = that.local().add(offsetAsMinutes + localTimezoneOffset, C.MIN)
    instance['$conf'].offset = offsetAsMinutes
    instance['$conf'].tzOffset = localTimezoneOffset
    return instance
  }
  return that.utc()
}

export default utcPlugin
