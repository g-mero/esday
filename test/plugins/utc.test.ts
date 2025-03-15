import type { EsDay, UnitType } from 'esday'
import { esday } from 'esday'
import moment from 'moment'

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { C } from '~/common'
import utcPlugin from '~/plugins/utc'
import { expectSame, expectSameResult } from '../util'

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
      expectSame(esday => esday().utc().year())
    })

    it('month', () => {
      expectSame(esday => esday().utc().month())
    })

    it('day', () => {
      expectSame(esday => esday().utc().date())
    })

    it('day of week', () => {
      expectSame(esday => esday().utc().day())
    })

    it('hour', () => {
      expectSame(esday => esday().utc().hour())
    })

    it('minute', () => {
      expectSame(esday => esday().utc().minute())
    })

    it('second', () => {
      expectSame(esday => esday().utc().second())
    })

    it('millisecond', () => {
      expectSame(esday => esday().utc().millisecond())
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
      expectSameResult(esday => esday().utc().set('year', 2008))
    })

    it('month', () => {
      expectSameResult(esday => esday().utc().set('month', 11))
    })

    it('day', () => {
      expectSameResult(esday => esday().utc().set('date', 30))
    })

    it('day to 45', () => {
      expectSameResult(esday => esday().utc().set('date', 45))
    })

    it('day of week to 0', () => {
      expectSameResult(esday => esday().utc().set('day', 0))
    })

    it('hour to 6', () => {
      expectSameResult(esday => esday().utc().set('hour', 6))
    })

    it('minute to 59', () => {
      expectSameResult(esday => esday().utc().set('minute', 59))
    })

    it('second to 59', () => {
      expectSameResult(esday => esday().utc().set('second', 59))
    })

    it('second to 110', () => {
      expectSameResult(esday => esday().utc().set('second', 110))
    })

    it('millisecond to 999', () => {
      expectSameResult(esday => esday().utc().set('millisecond', 999))
    })

    it('millisecond to 85', () => {
      expectSameResult(esday => esday().utc().set('millisecond', 85))
    })

    it('millisecond to 7', () => {
      expectSameResult(esday => esday().utc().set('millisecond', 7))
    })

    it('millisecond to 1234', () => {
      expectSameResult(esday => esday().utc().set('millisecond', 1234))
    })
  })

  describe('parse (without format)', () => {
    const fakeTimeAsString = '2023-12-17T03:24:46.234'

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(fakeTimeAsString))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('now with parsed date', () => {
      expectSameResult(esday => esday.utc())
    })

    it('now with converted date', () => {
      expectSameResult(esday => esday().utc())
    })

    it.each([
      '2018-09-06',
      '2018-09',
      '2018',
      '',
      '2017-04-22 19:50:16',
      '2012-01-02T08:20:00',
      '2011-02-02T03:04:05+06:00',
      '2011-02-02T03:04:05+00:00',
      '2012-01-02T08:20:00-09:00',
      '2019-03-25T06:41:00.999999999',
    ])('date string using "%s" with parsed date', (dateString) => {
      expectSameResult(esday => esday.utc(dateString))
    })

    it.each([
      '2018-09-06',
      '2018-09',
      '2018',
      '',
      '2017-04-22 19:50:16',
      '2012-01-02T08:20:00',
      '2011-02-02T03:04:05+06:00',
      '2011-02-02T03:04:05+00:00',
      '2012-01-02T08:20:00-09:00',
      '2019-03-25T06:41:00.999999999',
    ])('date string using "%s" with converted date', (dateString) => {
      expectSameResult(esday => esday(dateString).utc())
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
  })

  describe('parse (with format)', () => {
    const fakeTimeAsString = '2023-12-17T03:24:46.234'

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(fakeTimeAsString))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it.each([
      { dateString: '2011-02-02 03:04:05', format: 'YYYY-MM-DD HH:mm:ss' },
      { dateString: '2011-02-02 03:04:05Z', format: 'YYYY-MM-DD HH:mm:ss' },
    ])('"$dateString" using "$format"', ({ dateString, format }) => {
      expectSameResult(esday => esday.utc(dateString, format))
    })
  })

  describe('format (core)', () => {
    const fakeTimeAsString = '2023-12-17T03:24:46.234'

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(fakeTimeAsString))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

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
    const fakeTimeAsString = '2023-12-17T03:24:46.234'

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(fakeTimeAsString))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('convert to utc', () => {
      const dateString = '2016-05-03 22:15:01'

      expectSameResult(esday => esday(dateString).utc())
    })

    it('convert to utc with keepLocalTime', () => {
      const dateString = '2016-05-03 22:15:01'

      expectSameResult(esday => esday(dateString).utc(true))
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

      expectSame(esday => esday.utc(dateString).local().format())
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
      expectSame(esday => esday().format())
      expectSame(esday => esday().utcOffset())
    })

    it('for utc date generated without keepLocalTime', () => {
      expectSame(esday => esday().utc().format())
      expectSame(esday => esday().utc().utcOffset())
    })

    it('for utc date generated with keepLocalTime', () => {
      expectSame(esday => esday().utc(true).format())
      expectSame(esday => esday().utc(true).utcOffset())
    })
  })

  describe('utcOffset set', () => {
    const fakeTimeAsString = '2023-12-17T03:24:46.234'

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(fakeTimeAsString))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns an instance of EsDay', () => {
      const newDate: EsDay = esday().utcOffset(5)

      expect(newDate).toHaveProperty('valueOf')
    })

    it.each([
      { offset: 540 },
      { offset: -540 },
      { offset: 8 },
      { offset: -8 },
    ])('using offset "$offset"', ({ offset }) => {
      const dateString = '2021-02-28 19:40:10'

      expectSameResult(esday => esday(dateString).utc().utcOffset(offset))
    })

    it.each([
      { offset: 540 },
      { offset: -540 },
      { offset: 8 },
      { offset: -8 },
    ])('using offset "$offset" and keepLocalTime', ({ offset }) => {
      const dateString = '2021-02-28 19:40:10'

      expectSameResult(esday => esday(dateString).utc().utcOffset(offset))
    })

    it('using string offset "-08:00"', () => {
      const dateString = '2021-02-28 19:40:10'
      const hoursOffset = -8

      expectSameResult(esday => esday(dateString).utc().utcOffset(`-0${Math.abs(hoursOffset)}:00`, true))
    })

    it('using string offset "+08:00"', () => {
      const dateString = '2021-02-28 19:40:10'
      const hoursOffset = 8

      expectSameResult(esday => esday(dateString).utc().utcOffset(`+0${hoursOffset}:00`, true))
    })

    it('using string offset "-0800"', () => {
      const dateString = '2021-02-28 19:40:10'
      const hoursOffset = -8

      expectSameResult(esday => esday(dateString).utc().utcOffset(`-0${Math.abs(hoursOffset)}00`, true))
    })

    it('using string offset "+0800"', () => {
      const dateString = '2021-02-28 19:40:10'
      const hoursOffset = 8

      expectSameResult(esday => esday(dateString).utc().utcOffset(`+0${hoursOffset}00`, true))
    })

    it('using an invalid string value ("random")', () => {
      const dateString = '2021-02-28 19:40:10'

      expectSameResult(esday => esday(dateString).utc(true).utcOffset('random'))
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
      const esdayCloned = dateWithOffset.clone()

      expectSameResult(esday => esday(dateString).utcOffset(9))

      expectSameResult(esday => esday(dateString).utcOffset(9).clone())

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

      expect(esdayDate.utcOffset()).toEqual(0)
      expectSameResult(esday => esday(dateString).utc(true).utcOffset('+0000'))
    })

    it('sets utc mode (using offset "0")', () => {
      const esdayDate = esday().utcOffset(0)

      expect(esdayDate.isUTC()).toBeTruthy()
      expectSameResult(esday => esday().utcOffset(0))
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
      expectSameResult(esday => esday().utc().startOf(unit))
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
      expectSameResult(esday => esday().utc().endOf(unit))
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

      expectSameResult(esday => esday.utc(dateString).add(value, unit as UnitType))
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

      expectSameResult(esday => esday(dateString).utc().add(value, unit as UnitType))
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

      expectSameResult(esday => esday.utc(dateString).subtract(value, unit as UnitType))
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

      expectSameResult(esday => esday(dateString).utc().subtract(value, unit as UnitType))
    })
  })
})
