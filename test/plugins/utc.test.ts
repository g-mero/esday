import type { EsDay, UnitType } from 'esday'
import type { DurationInputArg2 } from 'moment'
import { esday } from 'esday'
import moment from 'moment'

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { C } from '~/common'
import utcPlugin from '~/plugins/utc'

esday.extend(utcPlugin)

describe('plugin utc', () => {
  describe('get', () => {
    const fakeTimeAsString = '2023-12-17T03:24:46.234'

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(fakeTimeAsString))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('year', () => {
      expect(esday().utc().year()).toBe(moment().utc().year())
    })

    it('month', () => {
      expect(esday().utc().month()).toBe(moment().utc().month())
    })

    it('day', () => {
      expect(esday().utc().date()).toBe(moment().utc().date())
    })

    it('day of week', () => {
      expect(esday().utc().day()).toBe(moment().utc().day())
    })

    it('hour', () => {
      expect(esday().utc().hour()).toBe(moment().utc().hour())
    })

    it('minute', () => {
      expect(esday().utc().minute()).toBe(moment().utc().minute())
    })

    it('second', () => {
      expect(esday().utc().second()).toBe(moment().utc().second())
    })

    it('millisecond', () => {
      expect(esday().utc().millisecond()).toBe(moment().utc().millisecond())
    })
  })

  describe('set', () => {
    const fakeTimeAsString = '2023-12-17T03:24:46.234'

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(fakeTimeAsString))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('year', () => {
      const esdayDate = esday().utc().set('year', 2008)
      const momentDate = moment().utc().set('year', 2008)

      expect(esdayDate.valueOf()).toBe(momentDate.valueOf())
      expect(esdayDate.isUTC()).toBe(momentDate.isUTC())
    })

    it('month', () => {
      expect(esday().utc().set('month', 11).valueOf()).toBe(moment().utc().set('month', 11).valueOf())
    })

    it('day', () => {
      expect(esday().utc().set('date', 30).valueOf()).toBe(moment().utc().set('date', 30).valueOf())
    })

    it('day of week', () => {
      expect(esday().utc().set('day', 0).valueOf()).toBe(moment().utc().set('day', 0).valueOf())
    })

    it('hour', () => {
      expect(esday().utc().set('hour', 6).valueOf()).toBe(moment().utc().set('hour', 6).valueOf())
    })

    it('minute', () => {
      expect(esday().utc().set('minute', 59).valueOf()).toBe(moment().utc().set('minute', 59).valueOf())
    })

    it('second', () => {
      expect(esday().utc().set('second', 59).valueOf()).toBe(moment().utc().set('second', 59).valueOf())
    })

    it('millisecond', () => {
      expect(esday().utc().set('millisecond', 999).valueOf()).toBe(moment().utc().set('millisecond', 999).valueOf())
    })
  })

  describe('parse (without format)', () => {
    it('now', () => {
      expect(esday.utc().format()).toBe(moment.utc().format())
      expect(esday().utc().format()).toBe(moment().utc().format())
    })

    it('date string using "2018-09-06"', () => {
      const dateString = '2018-09-06'

      expect(esday.utc(dateString).format()).toEqual(moment.utc(dateString).format())
      expect(esday.utc(dateString).format()).toEqual('2018-09-06T00:00:00Z')
      expect(esday(dateString).utc().format()).toEqual(moment(dateString).utc().format())
    })

    it('date string using "2018-09"', () => {
      const dateString = '2018-09'

      expect(esday.utc(dateString).format()).toEqual(moment.utc(dateString).format())
      expect(esday.utc(dateString).format()).toEqual('2018-09-01T00:00:00Z')
      expect(esday(dateString).utc().format()).toEqual(moment(dateString).utc().format())
    })

    it('date string using "2018"', () => {
      const dateString = '2018'

      expect(esday.utc(dateString).format()).toEqual(moment.utc(dateString).format())
      expect(esday.utc(dateString).format()).toEqual('2018-01-01T00:00:00Z')
      expect(esday(dateString).utc().format()).toEqual(moment(dateString).utc().format())
    })

    it('date time string without timezone using "2017-04-22 19:50:16"', () => {
      const dateString = '2017-04-22 19:50:16'

      expect(esday.utc(dateString).format()).toEqual('2017-04-22T19:50:16Z')
      expect(esday.utc(dateString).format()).toEqual(moment.utc(dateString).format())
      expect(esday(dateString).utc().format()).toBe(moment(dateString).utc().format())
    })

    it('date time string without timezone using "2012-01-02T08:20:00"', () => {
      const dateString = '2012-01-02T08:20:00'

      expect(esday.utc(dateString).format()).toEqual(moment.utc(dateString).format())
    })

    it('date time string with timezone (positive offset)', () => {
      const dateString = '2011-02-02T03:04:05+06:00'

      expect(esday.utc(dateString).format()).toEqual(moment.utc(dateString).format())
    })

    it('date time string with timezone ("0"" offset)', () => {
      const dateString = '2011-02-02T03:04:05+00:00'

      expect(esday.utc(dateString).format()).toEqual(moment.utc(dateString).format())
    })

    it('date time string with timezone (negative offset)', () => {
      const dateString = '2012-01-02T08:20:00-09:00'

      expect(esday.utc(dateString).format()).toEqual(moment.utc(dateString).format())
    })

    it('date time string with utc set in config', () => {
      const dateString = '2018-09-06T19:34:28Z'

      expect(esday(dateString, { utc: true }).format()).toEqual('2018-09-06T19:34:28Z')
      expect(esday(dateString, { utc: true }).format()).toEqual(moment(dateString).utc().format())
      expect(esday(dateString).utc().format()).toEqual('2018-09-06T19:34:28Z')
      expect(esday(dateString).utc().format()).toEqual(moment(dateString).utc().format())
      expect(esday.utc(dateString).format()).toEqual('2018-09-06T19:34:28Z')
      expect(esday.utc(dateString).format()).toEqual(moment.utc(dateString).format())
    })

    it('unlimited millisecond in date time string', () => {
      const dateString = '2019-03-25T06:41:00.999999999'
      const esdayDate = esday.utc(dateString)
      const momentDate = moment.utc(dateString)

      expect(esdayDate.valueOf()).toEqual(momentDate.valueOf())
      expect(esdayDate.millisecond()).toEqual(momentDate.millisecond())
    })
  })

  describe('parse (with format)', () => {
    it('"2011-02-02 03:04:05" using "YYYY-MM-DD HH:mm:ss"', () => {
      const dateString = '2011-02-02 03:04:05'
      const format = 'YYYY-MM-DD HH:mm:ss'
      const esdayDate = esday.utc(dateString, format)
      const momentDate = moment.utc(dateString, format)

      expect(esdayDate.format()).toBe('2011-02-02T03:04:05Z')
      expect(esdayDate.format()).toEqual(momentDate.format())
      expect(esdayDate.toDate()).toEqual(momentDate.toDate())
      expect(esdayDate.valueOf()).toEqual(momentDate.valueOf())
    })

    it('"2011-02-02 03:04:05Z" using "YYYY-MM-DD HH:mm:ss"', () => {
      const dateString = '2011-02-02 03:04:05Z'
      const format = 'YYYY-MM-DD HH:mm:ss'
      const esdayDate = esday.utc(dateString, format)
      const momentDate = moment.utc(dateString, format)

      expect(esdayDate.format()).toBe('2011-02-02T03:04:05Z')
      expect(esdayDate.format()).toEqual(momentDate.format())
      expect(esdayDate.toDate()).toEqual(momentDate.toDate())
      expect(esdayDate.valueOf()).toEqual(momentDate.valueOf())
    })
  })

  describe('format (core)', () => {
    it('does not break default format for local date time', () => {
      const dateString = '2018-09-06T19:34:28.65'
      const esdayDateFormat = esday(dateString).format()
      const momentDateFormat = moment(dateString).format()

      expect(esdayDateFormat).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}./)
      expect(esdayDateFormat).toBe(momentDateFormat)
    })

    it('does not break default format for local date time parsed as utc', () => {
      const dateString = '2018-09-06T19:34:28.65'
      const esdayDateFormat = esday.utc(dateString).format()
      const momentDateFormat = moment.utc(dateString).format()

      expect(esdayDateFormat).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}./)
      expect(esdayDateFormat).toBe(momentDateFormat)
    })

    it('does not break default format for local date time converted to utc', () => {
      const dateString = '2018-09-06T19:34:28.65'
      const esdayDateFormat = esday(dateString).utc().format()
      const momentDateFormat = moment(dateString).utc().format()

      expect(esdayDateFormat).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}./)
      expect(esdayDateFormat).toBe(momentDateFormat)
    })

    it('using "YYYY-MM-DD HH:mm:ss:SSS" parsing "2018-09-06T19:34:28.657Z"', () => {
      const dateString = '2018-09-06T19:34:28.657Z'
      const esdayDate = esday.utc(dateString)
      const momentDate = moment.utc(dateString)
      const format = 'YYYY-MM-DD_HH:mm:ss:SSS'

      expect(esdayDate.format(format)).toBe('2018-09-06_19:34:28:657')
      expect(esdayDate.format(format)).toBe(momentDate.format(format))
    })

    it('using "YYYY-MM-DD HH:mm:ss:SSS" converting "2018-09-06T19:34:28.657Z"', () => {
      const dateString = '2018-09-06T19:34:28.657Z'
      const esdayDate = esday(dateString).utc()
      const momentDate = moment(dateString).utc()
      const format = 'YYYY-MM-DD_HH:mm:ss:SSS'

      expect(esdayDate.format(format)).toBe('2018-09-06_19:34:28:657')
      expect(esdayDate.format(format)).toBe(momentDate.format(format))
    })

    it('using "HH-hh-mm-ss-SSS-Z-ZZ" parsing "2018-09-06T19:34:28.657Z"', () => {
      const dateString = '2018-09-06T19:34:28.657Z'
      const esdayDate = esday.utc(dateString)
      const format = 'HH-hh-mm-ss-SSS-Z-ZZ'

      expect(esdayDate.format(format)).toBe('19-07-34-28-657-+00:00-+0000')
      expect(esdayDate.format(format)).toBe(moment.utc(dateString).format(format))
    })

    it('using "HH-hh-mm-ss-SSS-Z-ZZ" converting "2018-09-06T19:34:28.657Z"', () => {
      const dateString = '2018-09-06T19:34:28.657Z'
      const esdayDate = esday(dateString).utc()
      const format = 'HH-hh-mm-ss-SSS-Z-ZZ'

      expect(esdayDate.format(format)).toBe('19-07-34-28-657-+00:00-+0000')
      expect(esdayDate.format(format)).toBe(moment.utc(dateString).format(format))
    })
  })

  describe('utc', () => {
    it('convert to utc', () => {
      const dateString = '2016-05-03 22:15:01'
      const esdayDate = esday(dateString).utc()
      const momentDate = moment(dateString).utc()

      expect(esdayDate.format()).toEqual(momentDate.format())
      expect(esdayDate.toDate()).toEqual(momentDate.toDate())
      expect(esdayDate.valueOf()).toEqual(momentDate.valueOf())
    })

    it('convert to utc with keepLocalTime', () => {
      const dateString = '2016-05-03 22:15:01'
      const esdayDate = esday(dateString).utc(true)
      const momentDate = moment(dateString).utc(true)

      expect(esdayDate.format()).toEqual(momentDate.format())
      expect(esdayDate.toDate()).toEqual(momentDate.toDate())
      expect(esdayDate.valueOf()).toEqual(momentDate.valueOf())
    })
  })

  describe('local', () => {
    const fakeTimeAsString = '2023-12-17T03:24:46.234'

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(fakeTimeAsString))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns a new instance', () => {
      const utcDate = esday.utc('2018-09-06T19:34:28.657Z')
      const localDate = utcDate.local()

      expect(localDate).not.toBe(utcDate)
    })

    it('returns the same formatted value as moment does', () => {
      const dateString = '2018-09-06'

      expect(esday.utc(dateString).local().format()).toEqual(moment.utc(dateString).local().format())
    })

    it('local date from utc date from local date is same', () => {
      // 'moment' is not invariable; therefore we create 3 new instances
      const esdayLocal = esday()
      const momentLocal = moment()
      expect(esdayLocal.isUTC()).toBeFalsy
      expect(momentLocal.isUTC()).toBeFalsy

      // convert to utc
      const esdayLocalUtc = esdayLocal.utc()
      const momentLocalUtc = moment().utc()
      expect(esdayLocalUtc.isUTC()).toBeTruthy
      expect(momentLocalUtc.isUTC()).toBeTruthy
      expect(esdayLocalUtc.utcOffset()).toBe(momentLocalUtc.utcOffset())

      // convert utc back zo local date
      const esdayLocalUtcLocal = esdayLocalUtc.local()
      const momentLocalUtcLocal = moment().utc().local()
      expect(esdayLocalUtcLocal.isUTC()).toBeFalsy
      expect(momentLocalUtcLocal.isUTC()).toBeFalsy
      expect(esdayLocalUtcLocal.isSame(esdayLocal)).toBeTruthy
      expect(momentLocalUtcLocal.isSame(momentLocal)).toBeTruthy
      expect(esdayLocalUtcLocal.format()).toEqual(momentLocalUtcLocal.format())
      expect(esdayLocalUtcLocal.valueOf()).toEqual(momentLocalUtcLocal.valueOf())
    })
  })

  describe('isUTC', () => {
    it('for created local time', () => {
      expect(esday().isUTC()).toBe(false)
    })

    it('for created utc time', () => {
      expect(esday.utc().isUTC()).toBe(true)
    })

    it('for converted utc time', () => {
      expect(esday().utc().isUTC()).toBe(true)
    })

    it('for twice converted time', () => {
      expect(esday().utc().local().isUTC()).toBe(false)
    })
  })

  describe('utcOffset get', () => {
    const fakeTimeAsString = '2023-12-17T03:24:46.234'

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(fakeTimeAsString))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns a number', () => {
      const offsetValue: number = esday().utcOffset()

      expect(offsetValue).toBeTypeOf('number')
    })

    it('for local date', () => {
      const esdayDate = esday()
      const momentDate = moment()

      expect(esdayDate.format()).toEqual(momentDate.format())
      expect(esdayDate.utcOffset()).toBe(momentDate.utcOffset())
    })

    it('for utc date generated without keepLocalTime', () => {
      const esdayDate = esday().utc()
      const momentDate = moment().utc()

      expect(esdayDate.format()).toEqual(momentDate.format())
      expect(esdayDate.utcOffset()).toBe(momentDate.utcOffset())
    })

    it('for utc date generated with keepLocalTime', () => {
      const esdayDate = esday().utc(true)
      const momentDate = moment().utc(true)

      expect(esdayDate.format()).toEqual(momentDate.format())
      expect(esdayDate.utcOffset()).toBe(momentDate.utcOffset())
    })
  })

  describe('utcOffset set', () => {
    it('returns an instance of EsDay', () => {
      const newDate: EsDay = esday().utcOffset(5)

      expect(newDate).toHaveProperty('valueOf')
    })

    it('using a positive number value only (minutes)', () => {
      const dateString = '2021-02-28 19:40:10'
      const offset = 540
      const esdayDateBase = esday(dateString).utc()
      const momentDateBase = moment(dateString).utc()
      const esdayDate = esday(esdayDateBase).utcOffset(offset)
      const momentDate = moment(momentDateBase).utcOffset(offset)

      expect(esdayDateBase.toISOString()).toBe(momentDateBase.toISOString())
      expect(esdayDate.utcOffset()).toEqual(offset)
      expect(esdayDate.utcOffset()).toEqual(momentDate.utcOffset())
      expect(esdayDate.toISOString()).toEqual(momentDate.toISOString())
    })

    it('using a negative number value only (minutes)', () => {
      const dateString = '2021-02-28 19:40:10'
      const offset = -540
      const esdayDate = esday(dateString).utc().utcOffset(offset)
      const momentDate = moment(dateString).utc().utcOffset(offset)

      expect(esdayDate.utcOffset()).toEqual(offset)
      expect(esdayDate.utcOffset()).toEqual(momentDate.utcOffset())
      expect(esdayDate.toISOString()).toEqual(momentDate.toISOString())
    })

    it('using a positive number value only (hours)', () => {
      const dateString = '2021-02-28 19:40:10'
      const offset = 8
      const esdayDate = esday(dateString).utc().utcOffset(offset)
      const momentDate = moment(dateString).utc().utcOffset(offset)

      expect(esdayDate.utcOffset()).toEqual(offset * 60)
      expect(esdayDate.utcOffset()).toEqual(momentDate.utcOffset())
      expect(esdayDate.toISOString()).toEqual(momentDate.toISOString())
    })

    it('using a negative number value only (hours)', () => {
      const dateString = '2021-02-28 19:40:10'
      const offset = -8
      const esdayDate = esday(dateString).utc().utcOffset(offset)
      const momentDate = moment(dateString).utc().utcOffset(offset)

      expect(esdayDate.utcOffset()).toEqual(offset * 60)
      expect(esdayDate.utcOffset()).toEqual(momentDate.utcOffset())
      expect(esdayDate.toISOString()).toEqual(momentDate.toISOString())
    })

    it('using a positive number value (minutes) and keepLocalTime', () => {
      const dateString = '2021-02-28 19:40:10'
      const offset = 540
      const esdayDate = esday(dateString).utc().utcOffset(offset, true)
      const momentDate = moment(dateString).utc().utcOffset(offset, true)

      expect(esdayDate.utcOffset()).toEqual(offset)
      expect(esdayDate.utcOffset()).toEqual(momentDate.utcOffset())
      expect(esdayDate.toISOString()).toEqual(momentDate.toISOString())
      expect(esdayDate.toDate()).toEqual(momentDate.toDate())
      expect(esdayDate.valueOf()).toEqual(momentDate.valueOf())
      expect(esdayDate.format()).toEqual(momentDate.format())
    })

    it('using a negative number value (minutes) and keepLocalTime', () => {
      const dateString = '2021-02-28 19:40:10'
      const offset = -540
      const esdayDate = esday(dateString).utc().utcOffset(offset, true)
      const momentDate = moment(dateString).utc().utcOffset(offset, true)

      expect(esdayDate.utcOffset()).toEqual(offset)
      expect(esdayDate.utcOffset()).toEqual(momentDate.utcOffset())
      expect(esdayDate.toISOString()).toEqual(momentDate.toISOString())
      expect(esdayDate.format()).toEqual(momentDate.format())
    })

    it('using a positive number value (hours) and keepLocalTime', () => {
      const dateString = '2021-02-28 19:40:10'
      const offset = 7
      const esdayDate = esday(dateString).utc().utcOffset(offset, true)
      const momentDate = moment(dateString).utc().utcOffset(offset, true)

      expect(esdayDate.utcOffset()).toEqual(offset * 60)
      expect(esdayDate.utcOffset()).toEqual(momentDate.utcOffset())
      expect(esdayDate.toISOString()).toEqual(momentDate.toISOString())
      expect(esdayDate.format()).toEqual(momentDate.format())
    })

    it('using a negative number value (hours) and keepLocalTime', () => {
      const dateString = '2021-02-28 19:40:10'
      const offset = -7
      const esdayDate = esday(dateString).utc().utcOffset(offset, true)
      const momentDate = moment(dateString).utc().utcOffset(offset, true)

      expect(esdayDate.utcOffset()).toEqual(offset * 60)
      expect(esdayDate.utcOffset()).toEqual(momentDate.utcOffset())
      expect(esdayDate.toISOString()).toEqual(momentDate.toISOString())
      expect(esdayDate.format()).toEqual(momentDate.format())
    })

    it('using a negative valid string value, format: HH:mm', () => {
      const dateString = '2021-02-28 19:40:10'
      const hoursOffset = -8
      const esdayDate = esday(dateString).utc().utcOffset(`-0${Math.abs(hoursOffset)}:00`, true)
      const momentDate = moment(dateString).utc().utcOffset(`-0${Math.abs(hoursOffset)}:00`, true)

      expect(esdayDate.utcOffset()).toEqual(hoursOffset * 60)
      expect(esdayDate.utcOffset()).toEqual(momentDate.utcOffset())
      expect(esdayDate.toISOString()).toEqual(momentDate.toISOString())
      expect(esdayDate.format()).toEqual(momentDate.format())
    })

    it('using a positive valid string value, format: HH:mm', () => {
      const dateString = '2021-02-28 19:40:10'
      const hoursOffset = 8
      const esdayDate = esday(dateString).utc().utcOffset(`+0${hoursOffset}:00`, true)
      const momentDate = moment(dateString).utc().utcOffset(`+0${hoursOffset}:00`, true)

      expect(esdayDate.utcOffset()).toEqual(hoursOffset * 60)
      expect(esdayDate.utcOffset()).toEqual(momentDate.utcOffset())
      expect(esdayDate.toISOString()).toEqual(momentDate.toISOString())
      expect(esdayDate.format()).toEqual(momentDate.format())
    })

    it('using a negative valid string value, format: HHmm', () => {
      const dateString = '2021-02-28 19:40:10'
      const hoursOffset = -8
      const esdayDate = esday(dateString).utc().utcOffset(`-0${Math.abs(hoursOffset)}00`, true)
      const momentDate = moment(dateString).utc().utcOffset(`-0${Math.abs(hoursOffset)}00`, true)

      expect(esdayDate.utcOffset()).toEqual(hoursOffset * 60)
      expect(esdayDate.utcOffset()).toEqual(momentDate.utcOffset())
      expect(esdayDate.toISOString()).toEqual(momentDate.toISOString())
      expect(esdayDate.format()).toEqual(momentDate.format())
    })

    it('using a positive valid string value, format: HHmm', () => {
      const dateString = '2021-02-28 19:40:10'
      const hoursOffset = 8
      const esdayDate = esday(dateString).utc().utcOffset(`+0${hoursOffset}00`, true)
      const momentDate = moment(dateString).utc().utcOffset(`+0${hoursOffset}00`, true)

      expect(esdayDate.utcOffset()).toEqual(hoursOffset * 60)
      expect(esdayDate.utcOffset()).toEqual(momentDate.utcOffset())
      expect(esdayDate.toISOString()).toEqual(momentDate.toISOString())
      expect(esdayDate.format()).toEqual(momentDate.format())
    })

    it('using an invalid string value ("random")', () => {
      const dateString = '2021-02-28 19:40:10'
      const esdayDate = esday(dateString).utc(true).utcOffset('random')
      const momentDate = moment(dateString).utc(true).utcOffset('random')

      expect(esdayDate.utcOffset()).toEqual(0)
      expect(esdayDate.utcOffset()).toEqual(momentDate.utcOffset())
      expect(esdayDate.toISOString()).toEqual(momentDate.toISOString())
    })

    it('changes hours when changing the utc offset in UTC mode using a number', () => {
      const esdayDate = esday.utc('2000-01-01T06:31:00Z')

      expect(esdayDate.hour()).toBe(6)
      expect(esdayDate.utcOffset(0).hour()).toBe(6)
      expect(esdayDate.utcOffset(-60).hour()).toBe(5)
      expect(esdayDate.utcOffset(60).hour()).toBe(7)
    })

    it('changes hours when changing the utc offset in UTC mode using a time string', () => {
      const esdayDate = esday.utc('2000-01-01T06:31:00Z')

      expect(esdayDate.hour()).toBe(6)
      expect(esdayDate.utcOffset(-30).format('HH:mm')).toBe('06:01')
      expect(esdayDate.utcOffset(30).format('HH:mm')).toBe('07:01')
      expect(esdayDate.utcOffset(-1380).format('HH:mm')).toBe('07:31')
    })

    it('offset not changed after clone', () => {
      const dateString = '2021-02-28T09:40:10'
      const dateWithOffset = esday(dateString).utcOffset(9)
      const momentWithOffset = moment(dateString).utcOffset(9)
      const esdayCloned = dateWithOffset.clone()
      const momentCloned = momentWithOffset.clone()

      expect(dateWithOffset.format()).toBe(momentWithOffset.format())
      expect(dateWithOffset.valueOf()).toBe(momentWithOffset.valueOf())
      expect(dateWithOffset.utcOffset()).toBe(momentWithOffset.utcOffset())
      expect(dateWithOffset.toDate()).toEqual(momentWithOffset.toDate())

      expect(esdayCloned.format()).toBe(momentCloned.format())
      expect(esdayCloned.valueOf()).toBe(momentCloned.valueOf())
      expect(esdayCloned.utcOffset()).toBe(momentCloned.utcOffset())
      expect(esdayCloned.toDate()).toEqual(momentCloned.toDate())

      expect(dateWithOffset).not.toBe(esdayCloned)
      expect(dateWithOffset.valueOf()).toBe(esdayCloned.valueOf())
      expect(dateWithOffset.utcOffset()).toBe(esdayCloned.utcOffset())
      expect(dateWithOffset.format()).toEqual(esdayCloned.format())
      expect(dateWithOffset.toDate()).toEqual(esdayCloned.toDate())
    })

    it('returns a new instance', () => {
      const esdayDate = esday()
      const esdayDateUpdated = esdayDate.utcOffset(esdayDate.utcOffset() + 1)

      expect(esdayDate).not.toBe(esdayDateUpdated)
      expect(esdayDate.utcOffset()).not.toBe(esdayDateUpdated.utcOffset())
      expect(esdayDate.format()).not.toBe(esdayDateUpdated.format())
    })

    it('sets utc mode (using string offset "+0000")', () => {
      const dateString = '2021-02-28 19:40:10'
      const esdayDate = esday(dateString).utc(true).utcOffset('+0000')
      const momentDate = moment(dateString).utc(true).utcOffset('+0000')

      expect(esdayDate.utcOffset()).toEqual(0)
      expect(esdayDate.utcOffset()).toEqual(momentDate.utcOffset())
      expect(esdayDate.toISOString()).toEqual(momentDate.toISOString())
    })

    it('sets utc mode (using offset "0")', () => {
      const esdayDate = esday().utcOffset(0)
      const momentDate = esday().utcOffset(0)

      expect(esdayDate.isUTC()).toBeTruthy()
      expect(esdayDate.format()).toBe(momentDate.format())
    })

    it('resets utc mode (using offset "1")', () => {
      const esdayDate = esday('2000-01-01T06:00:00Z')

      expect(esdayDate.isUTC()).toBeFalsy()
      expect(esdayDate.utcOffset(0).isUTC()).toBeTruthy()
      expect(esdayDate.utcOffset(1).isUTC()).toBeFalsy()
    })
  })

  describe('clone', () => {
    it('on parsed utc date retains the utc mode', () => {
      const esdayDate = esday.utc('2018-09-06')
      const clonedDate = esdayDate.clone()

      expect(clonedDate.isUTC()).toBeTruthy()
    })

    it('on converted local date retains the utc mode', () => {
      const esdayDate = esday('2018-09-06').utc()
      const clonedDate = esdayDate.clone()

      expect(clonedDate.isUTC()).toBeTruthy()
    })
  })

  describe('startOf and endOf', () => {
    // weekday of fake date is a sunday
    const fakeTimeAsString = '2023-12-17T03:24:46.234'
    let momentDefaultLocaleData: any

    beforeAll(() => {
      momentDefaultLocaleData = moment.localeData()

      // Change firstDayOfWeek to SIO 8601 used by esday
      moment.updateLocale('en', {
        week: {
          dow: 1,
        },
      })
    })

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(fakeTimeAsString))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    afterAll(() => {
      moment.locale(momentDefaultLocaleData._abbr)
    })

    it.each([
      C.YEAR,
      C.MONTH,
      C.DAY,
      C.DATE,
      C.WEEK,
      C.HOUR,
      C.MIN,
      C.SECOND,
    ])('startOf in UTC mode for "%s"', (unit) => {
      expect(esday().utc().startOf(unit).format()).toBe(moment().utc().startOf(unit).format())
    })

    it.each([
      C.YEAR,
      C.MONTH,
      C.DAY,
      C.DATE,
      C.WEEK,
      C.HOUR,
      C.MIN,
      C.SECOND,
    ])('endOf in UTC mode for "%s"', (unit) => {
      expect(esday().utc().endOf(unit).format()).toBe(moment().utc().endOf(unit).format())
    })
  })

  describe('add', () => {
    it.each([
      { value: 2, unit: 'year' },
      { value: 3, unit: 'month' },
      { value: 1, unit: 'day' },
      { value: 4, unit: 'hour' },
      { value: 5, unit: 'minute' },
      { value: 6, unit: 'second' },
    ])('"$value $unit" to date parsed as utc', ({ value, unit }) => {
      const dateString = '2018-09-06T19:34:28.652'
      const esdayDate = esday.utc(dateString).add(value, unit as UnitType)
      const momentDate = moment.utc(dateString).add(value, unit as DurationInputArg2)

      expect(esdayDate.format()).toEqual(momentDate.format())
      expect(esdayDate.toDate()).toEqual(momentDate.toDate())
      expect(esdayDate.valueOf()).toEqual(momentDate.valueOf())
    })

    it.each([
      { value: 2, unit: 'year' },
      { value: 3, unit: 'month' },
      { value: 1, unit: 'day' },
      { value: 4, unit: 'hour' },
      { value: 5, unit: 'minute' },
      { value: 6, unit: 'second' },
    ])('"$value $unit" to date converted to utc', ({ value, unit }) => {
      const dateString = '2018-09-06T19:34:28.652'
      const esdayDate = esday(dateString).utc().add(value, unit as UnitType)
      const momentDate = moment(dateString).utc().add(value, unit as DurationInputArg2)

      expect(esdayDate.format()).toEqual(momentDate.format())
      expect(esdayDate.toDate()).toEqual(momentDate.toDate())
      expect(esdayDate.valueOf()).toEqual(momentDate.valueOf())
    })
  })

  describe('subtract', () => {
    it.each([
      { value: 2, unit: 'year' },
      { value: 3, unit: 'month' },
      { value: 1, unit: 'day' },
      { value: 4, unit: 'hour' },
      { value: 5, unit: 'minute' },
      { value: 6, unit: 'second' },
    ])('"$value $unit" to date parsed as utc', ({ value, unit }) => {
      const dateString = '2018-09-06T19:34:28.652'
      const esdayDate = esday.utc(dateString).subtract(value, unit as UnitType)
      const momentDate = moment.utc(dateString).subtract(value, unit as DurationInputArg2)

      expect(esdayDate.format()).toEqual(momentDate.format())
      expect(esdayDate.toDate()).toEqual(momentDate.toDate())
      expect(esdayDate.valueOf()).toEqual(momentDate.valueOf())
    })

    it.each([
      { value: 2, unit: 'year' },
      { value: 3, unit: 'month' },
      { value: 1, unit: 'day' },
      { value: 4, unit: 'hour' },
      { value: 5, unit: 'minute' },
      { value: 6, unit: 'second' },
    ])('"$value $unit" to date converted to utc', ({ value, unit }) => {
      const dateString = '2018-09-06T19:34:28.652'
      const esdayDate = esday(dateString).utc().subtract(value, unit as UnitType)
      const momentDate = moment(dateString).utc().subtract(value, unit as DurationInputArg2)

      expect(esdayDate.format()).toEqual(momentDate.format())
      expect(esdayDate.toDate()).toEqual(momentDate.toDate())
      expect(esdayDate.valueOf()).toEqual(momentDate.valueOf())
    })
  })
})
