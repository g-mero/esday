/* eslint-disable dot-notation */
import type { UnitDay } from '~/common'
/**
 * utc plugin
 *
 * when utc mode is enabled, get and set methods will use UTC time
 *
 */

import type { DateType, EsDayPlugin } from '~/types'
import { C, getUnitInDate, getUnitInDateUTC, isUndefined, prettyUnit, setUnitInDateUTC } from '~/common'
import { MILLISECONDS_A_MINUTE, MIN } from '~/common/constants'

const REGEX_VALID_OFFSET_FORMAT = /[+-]\d\d(?::?\d\d)?/g
const REGEX_OFFSET_HOURS_MINUTES_FORMAT = /[+-]|\d\d/g
function offsetFromString(value = '') {
  const offset = value.match(REGEX_VALID_OFFSET_FORMAT)

  if (!offset) {
    return null
  }

  const [indicator, hoursOffset, minutesOffset] = `${offset[0]}`.match(REGEX_OFFSET_HOURS_MINUTES_FORMAT) || ['-', 0, 0]
  const totalOffsetInMinutes = (+hoursOffset * 60) + (+minutesOffset)

  if (totalOffsetInMinutes === 0) {
    return 0
  }

  return indicator === '+' ? totalOffsetInMinutes : -totalOffsetInMinutes
}

declare module 'esday' {
  interface utcOffsetFunction {
    (): number
    (offset: number | string, keepLocalTime?: boolean): EsDay;
  }
  interface EsDay {
    utc: (keepLocalTime?: boolean) => EsDay
    local: () => EsDay
    isUTC: () => boolean
    // eslint-disable-next-line ts/method-signature-style
    utcOffset(offset: number | string, keepLocalTime?: boolean): EsDay
    // eslint-disable-next-line ts/method-signature-style
    toDate(type?: string): Date
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
      // TODO maybe the generated time does not exits in the current timezone
      return inst.add(this.utcOffset(), MIN)
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

  proto.utcOffset = function () {
    return -Math.round(this['$d'].getTimezoneOffset())
  }

  const oldFormat = proto.format
  proto.format = function (formatStr) {
    const UTC_FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ss[Z]'
    const str = formatStr || (this['$conf'].utc ? UTC_FORMAT_DEFAULT : '')
    return oldFormat.call(this, str)
  }

  // change method 'parse'
  proto['parse'] = function (date?: DateType) {
    this['$d'] = this['$parseDate'](date, !!this['$conf'].utc)
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
      }
      else {
        setUnitInDateUTC($date, unit as Exclude<typeof unit, UnitDay>, values)
      }

      return this
    }
    return old$set.call(this, unit, values)
  }

  proto.valueOf = function () {
    const offset = this['$conf'].offset as number
    const localOffset = this['$conf'].localOffset as number
    const addedOffset = !isUndefined(offset)
      ? offset + (localOffset || this['$d'].getTimezoneOffset())
      : 0
    return this['$d'].valueOf() - (addedOffset * MILLISECONDS_A_MINUTE)
  }

  proto.toISOString = function () {
    return this.toDate().toISOString()
  }

  proto.toString = function () {
    return this.toDate().toUTCString()
  }

  const oldToDate = proto.toDate
  // @ts-expect-error it's compatible with its overload
  proto.toDate = function (type) {
    if (type === 's' && this['$conf'].offset) {
      return dayFactory(this.format('YYYY-MM-DD HH:mm:ss:SSS')).toDate()
    }
    return oldToDate.call(this)
  }

  const oldUtcOffset = proto.utcOffset as (() => number)
  // @ts-expect-error it's compatible with its overload
  proto.utcOffset = function (offset, keepLocalTime) {
    if (isUndefined(offset)) {
      if (this['$conf'].utc) {
        return 0
      }

      return this['$conf'].offset || oldUtcOffset.call(this)
    }

    let realOffset: number = 0
    if (typeof offset === 'string') {
      const temp = offsetFromString(offset)
      if (temp === null) {
        return this
      }
      realOffset = temp
    }
    else {
      realOffset = offset
    }
    realOffset = Math.abs(realOffset) <= 16 ? realOffset * 60 : realOffset
    // eslint-disable-next-line ts/no-this-alias
    let ins = this
    if (keepLocalTime) {
      ins['$conf'].offset = realOffset
      ins['$conf'].utc = offset === 0
      return ins
    }
    if (realOffset !== 0) {
      const localTimezoneOffset = this['$conf'].utc
        ? this.toDate().getTimezoneOffset()
        : -1 * this.utcOffset()
      ins = this.local().add(realOffset + localTimezoneOffset, MIN)
      ins['$conf'].offset = realOffset
      ins['$conf'].localOffset = localTimezoneOffset
    }
    else {
      ins = this.utc()
    }
    return ins
  }
}

export default utcPlugin
