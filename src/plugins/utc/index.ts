/* eslint-disable dot-notation */
/**
 * utc plugin
 *
 * when utc mode is enabled, get and set methods will use UTC time
 *
 */
import type { DateType, EsDayPlugin } from '~/types'
import { getUnitInDate, undefinedOr } from '~/common'

declare module 'esday' {
  interface EsDay {
    utc: () => EsDay
    local: () => EsDay
    isUTC: () => boolean
  }

  interface EsDayFactory {
    utc: (date?: DateType, ...others: any[]) => EsDay
  }
}

export const utcPlugin: EsDayPlugin<{}> = (_, dayClass, dayFactory) => {
  dayFactory.utc = (d?: DateType, ...others: any[]) => {
    const inst = dayFactory(d, ...others, { utc: true })
    return inst
  }

  dayClass.prototype.utc = function () {
    const inst = this.clone()
    inst['$conf'].utc = true
    return inst
  }

  dayClass.prototype.local = function () {
    const inst = this.clone()
    inst['$conf'].utc = false
    return inst
  }

  dayClass.prototype.isUTC = function () {
    return !!this['$conf'].utc
  }

  const oldFormat = dayClass.prototype.format
  dayClass.prototype.format = function (formatStr) {
    const UTC_FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ss[Z]'
    const str = formatStr || (this['$conf'].utc ? UTC_FORMAT_DEFAULT : '')
    return oldFormat.call(this, str)
  }

  // change method 'parse'
  dayClass.prototype['parse'] = function (date?: DateType) {
    this['$d'] = this['$parseDate'](date, !!this['$conf'].utc)
  }

  // change method '$get' and '$set' to support utc
  dayClass.prototype['get'] = function (unit) {
    return getUnitInDate(this['$d'], unit, !!this['$conf'].utc)
  }

  const old$set = dayClass.prototype['$set']
  dayClass.prototype['$set'] = function (unit, value, utc) {
    return old$set.call(this, unit, value, undefinedOr(utc, !!this['$conf'].utc))
  }
}
