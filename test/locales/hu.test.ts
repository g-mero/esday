/**
 * Test for locale 'Hungarian [hu]'
 */

import type { EsDay } from 'esday'
import { describe, expect, it } from 'vitest'
import locale from '~/locales/hu'
import type { CalendarSpecValFunction, RelativeTimeElementFunction } from '~/plugins'

describe('locale hu', () => {
  it('should have the correct name', () => {
    expect(locale.name).toBe('hu')
  })

  it('should have 7 weekday names', () => {
    expect(locale.weekdays).toBeDefined()
    if (Array.isArray(locale.weekdays)) {
      expect(locale.weekdays.length).toBe(7)
    } else {
      expect(locale.weekdays).toBeTypeOf('function')
    }
  })

  it('should have 7 short weekday names', () => {
    expect(locale.weekdaysShort).toBeDefined()
    expect(locale.weekdaysShort?.length).toBe(7)
  })

  it('should have 7 minimal weekday names', () => {
    expect(locale.weekdaysMin).toBeDefined()
    expect(locale.weekdaysMin?.length).toBe(7)
  })

  it('should have 12 month names', () => {
    expect(locale.months).toBeDefined()
    if (Array.isArray(locale.months)) {
      expect(locale.months.length).toBe(12)
    } else {
      expect(locale.months).toBeTypeOf('function')
    }
  })

  it('should have 12 short month names', () => {
    expect(locale.monthsShort).toBeDefined()
    if (Array.isArray(locale.monthsShort)) {
      expect(locale.monthsShort.length).toBe(12)
    } else {
      expect(locale.monthsShort).toBeTypeOf('function')
    }
  })

  it('should have a method named "ordinal"', () => {
    expect(locale.ordinal).toBeDefined()
    expect(locale.ordinal).toBeTypeOf('function')
    expect(locale.ordinal(2)).toBe('2.')
  })

  it('should have numeric property named weekStart', () => {
    expect(locale.weekStart).toBeDefined()
    expect(locale.weekStart).toBeTypeOf('number')
    expect(locale.weekStart).toSatisfy((value: number) => value >= 0 && value <= 6)
  })

  it('should have numeric property named yearStart', () => {
    expect(locale.yearStart).toBeDefined()
    expect(locale.yearStart).toBeTypeOf('number')
    expect(locale.yearStart).toSatisfy((value: number) => value >= 1 && value <= 7)
  })

  it('should have have an object named "formats" with 10 properties', () => {
    expect(locale.formats).toBeDefined()
    expect(locale.formats).toBeTypeOf('object')
    expect(Object.keys(locale.formats ?? {})).toHaveLength(10)
  })

  it('should have an object named "calendar"', () => {
    expect(locale.calendar).toBeDefined()
    expect(locale.calendar).toBeTypeOf('object')
    expect(Object.keys(locale.calendar ?? {}).length).toBe(6)
  })

  it.each([
    { weekday: 0, expected: '[vasárnap] LT[-kor]' },
    { weekday: 1, expected: '[hétfőn] LT[-kor]' },
    { weekday: 2, expected: '[kedden] LT[-kor]' },
    { weekday: 3, expected: '[szerdán] LT[-kor]' },
    { weekday: 4, expected: '[csütörtökön] LT[-kor]' },
    { weekday: 5, expected: '[pénteken] LT[-kor]' },
    { weekday: 6, expected: '[szombaton] LT[-kor]' },
  ])('should format nextWeek with calendar for weekday "$weekday"', ({ weekday, expected }) => {
    const referenceDate = { day: () => weekday } as EsDay
    const nextWeek = locale.calendar.nextWeek as CalendarSpecValFunction

    expect(nextWeek.call(referenceDate)).toBe(expected)
  })

  it.each([
    { weekday: 0, expected: '[múlt] [vasárnap] LT[-kor]' },
    { weekday: 1, expected: '[múlt] [hétfőn] LT[-kor]' },
    { weekday: 2, expected: '[múlt] [kedden] LT[-kor]' },
    { weekday: 3, expected: '[múlt] [szerdán] LT[-kor]' },
    { weekday: 4, expected: '[múlt] [csütörtökön] LT[-kor]' },
    { weekday: 5, expected: '[múlt] [pénteken] LT[-kor]' },
    { weekday: 6, expected: '[múlt] [szombaton] LT[-kor]' },
  ])('should format lastWeek with calendar for weekday "$weekday"', ({ weekday, expected }) => {
    const referenceDate = { day: () => weekday } as EsDay
    const lastWeek = locale.calendar.lastWeek as CalendarSpecValFunction

    expect(lastWeek.call(referenceDate)).toBe(expected)
  })

  it('should have an object named "relativeTime"', () => {
    expect(locale.relativeTime).toBeDefined()
    expect(locale.relativeTime).toBeTypeOf('object')
    expect(Object.keys(locale.relativeTime ?? {}).length).toBe(14)

    const rtFunctionSecond = locale.relativeTime.s as RelativeTimeElementFunction
    expect(rtFunctionSecond(1, false, 's', false)).toBe('néhány másodperce')
    expect(rtFunctionSecond(2, false, 's', true)).toBe('néhány másodperc')
    expect(rtFunctionSecond(5, true, 's', false)).toBe('néhány másodperc')
    expect(rtFunctionSecond(1, true, 's', true)).toBe('néhány másodperc')

    const rtFunctionSeconds = locale.relativeTime.ss as RelativeTimeElementFunction
    expect(rtFunctionSeconds(1, false, 'ss', false)).toBe('1 másodperce')
    expect(rtFunctionSeconds(2, false, 'ss', true)).toBe('2 másodperc')
    expect(rtFunctionSeconds(5, true, 'ss', false)).toBe('5 másodperc')
    expect(rtFunctionSeconds(6, true, 'ss', true)).toBe('6 másodperc')

    const rtFunctionMinute = locale.relativeTime.m as RelativeTimeElementFunction
    expect(rtFunctionMinute(1, false, 'm', false)).toBe('egy perce')
    expect(rtFunctionMinute(2, false, 'm', true)).toBe('egy perc')
    expect(rtFunctionMinute(2, true, 'm', false)).toBe('egy perc')
    expect(rtFunctionMinute(2, true, 'm', true)).toBe('egy perc')

    const rtFunctionMinutes = locale.relativeTime.mm as RelativeTimeElementFunction
    expect(rtFunctionMinutes(1, false, 'mm', false)).toBe('1 perce')
    expect(rtFunctionMinutes(2, false, 'mm', true)).toBe('2 perc')
    expect(rtFunctionMinutes(3, true, 'mm', false)).toBe('3 perc')
    expect(rtFunctionMinutes(4, true, 'mm', true)).toBe('4 perc')

    const rtFunctionHour = locale.relativeTime.h as RelativeTimeElementFunction
    expect(rtFunctionHour(1, false, 'h', false)).toBe('egy órája')
    expect(rtFunctionHour(2, false, 'h', true)).toBe('egy óra')
    expect(rtFunctionHour(2, true, 'h', false)).toBe('egy óra')
    expect(rtFunctionHour(2, true, 'h', true)).toBe('egy óra')

    const rtFunctionHours = locale.relativeTime.hh as RelativeTimeElementFunction
    expect(rtFunctionHours(1, false, 'hh', false)).toBe('1 órája')
    expect(rtFunctionHours(2, false, 'hh', true)).toBe('2 óra')
    expect(rtFunctionHours(4, true, 'hh', false)).toBe('4 óra')
    expect(rtFunctionHours(5, true, 'hh', true)).toBe('5 óra')

    const rtFunctionDay = locale.relativeTime.d as RelativeTimeElementFunction
    expect(rtFunctionDay(1, false, 'd', false)).toBe('egy napja')
    expect(rtFunctionDay(2, false, 'd', true)).toBe('egy nap')
    expect(rtFunctionDay(3, true, 'd', false)).toBe('egy nap')
    expect(rtFunctionDay(4, true, 'd', true)).toBe('egy nap')

    const rtFunctionDays = locale.relativeTime.dd as RelativeTimeElementFunction
    expect(rtFunctionDays(1, false, 'dd', false)).toBe('1 napja')
    expect(rtFunctionDays(2, false, 'dd', true)).toBe('2 nap')
    expect(rtFunctionDays(3, true, 'dd', false)).toBe('3 nap')
    expect(rtFunctionDays(4, true, 'dd', true)).toBe('4 nap')

    const rtFunctionMonth = locale.relativeTime.M as RelativeTimeElementFunction
    expect(rtFunctionMonth(1, false, 'M', false)).toBe('egy hónapja')
    expect(rtFunctionMonth(2, false, 'M', true)).toBe('egy hónap')
    expect(rtFunctionMonth(4, true, 'M', false)).toBe('egy hónap')
    expect(rtFunctionMonth(5, true, 'M', true)).toBe('egy hónap')

    const rtFunctionMonths = locale.relativeTime.MM as RelativeTimeElementFunction
    expect(rtFunctionMonths(1, false, 'MM', false)).toBe('1 hónapja')
    expect(rtFunctionMonths(2, false, 'MM', true)).toBe('2 hónap')
    expect(rtFunctionMonths(4, true, 'MM', false)).toBe('4 hónap')
    expect(rtFunctionMonths(5, true, 'MM', true)).toBe('5 hónap')

    const rtFunctionYear = locale.relativeTime.y as RelativeTimeElementFunction
    expect(rtFunctionYear(1, false, 'y', false)).toBe('egy éve')
    expect(rtFunctionYear(2, false, 'y', true)).toBe('egy év')
    expect(rtFunctionYear(3, true, 'y', false)).toBe('egy év')
    expect(rtFunctionYear(5, true, 'y', true)).toBe('egy év')

    const rtFunctionYears = locale.relativeTime.yy as RelativeTimeElementFunction
    expect(rtFunctionYears(1, false, 'yy', false)).toBe('1 éve')
    expect(rtFunctionYears(2, false, 'yy', true)).toBe('2 év')
    expect(rtFunctionYears(3, true, 'yy', false)).toBe('3 év')
    expect(rtFunctionYears(5, true, 'yy', true)).toBe('5 év')

    // test for unknown token
    expect(rtFunctionYears(5, true, 'ab', true)).toBe('')
  })

  it('should have a method named "meridiem"', () => {
    expect(locale.meridiem).toBeDefined()
    expect(locale.meridiem).toBeTypeOf('function')
    expect(locale.meridiem(10, 0, false)).toBe('AM')
    expect(locale.meridiem(10, 0, true)).toBe('am')
    expect(locale.meridiem(20, 0, false)).toBe('PM')
    expect(locale.meridiem(20, 0, true)).toBe('pm')
  })
})
