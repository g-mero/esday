/**
 * Test for locale 'Talossan [tzl]'
 */

import { describe, expect, it } from 'vitest'
import locale from '~/locales/tzl'
import type { RelativeTimeElementFunction } from '~/plugins'

describe('locale tzl', () => {
  it('should have the correct name', () => {
    expect(locale.name).toBe('tzl')
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

  it('should have an object named "relativeTime"', () => {
    expect(locale.relativeTime).toBeDefined()
    expect(locale.relativeTime).toBeTypeOf('object')
    expect(Object.keys(locale.relativeTime ?? {}).length).toBe(14)
  })

  it.each([
    { token: 's', value: 1, noSuffix: false, key: 's', future: false, expected: "'iensas secunds" },
    { token: 's', value: 1, noSuffix: true, key: 's', future: false, expected: 'viensas secunds' },
    { token: 's', value: 1, noSuffix: false, key: 's', future: true, expected: 'viensas secunds' },
    { token: 's', value: 1, noSuffix: true, key: 's', future: true, expected: 'viensas secunds' },
    { token: 'ss', value: 1, noSuffix: false, key: 'ss', future: false, expected: '1 secunds' },
    { token: 'ss', value: 1, noSuffix: true, key: 'ss', future: false, expected: '1 secunds' },
    { token: 'ss', value: 11, noSuffix: false, key: 'ss', future: true, expected: '11 secunds' },
    { token: 'ss', value: 11, noSuffix: true, key: 'ss', future: true, expected: '11 secunds' },
    { token: 'm', value: 1, noSuffix: false, key: 'm', future: false, expected: "'iens míut" },
    { token: 'm', value: 1, noSuffix: true, key: 'm', future: false, expected: "'n míut" },
    { token: 'm', value: 1, noSuffix: false, key: 'm', future: true, expected: "'n míut" },
    { token: 'm', value: 1, noSuffix: true, key: 'm', future: true, expected: "'n míut" },
    { token: 'mm', value: 1, noSuffix: false, key: 'mm', future: false, expected: '1 míuts' },
    { token: 'mm', value: 11, noSuffix: true, key: 'mm', future: false, expected: '11 míuts' },
    { token: 'mm', value: 11, noSuffix: false, key: 'mm', future: true, expected: '11 míuts' },
    { token: 'mm', value: 1, noSuffix: true, key: 'mm', future: true, expected: '1 míuts' },
    { token: 'h', value: 1, noSuffix: false, key: 'h', future: false, expected: "'iensa þora" },
    { token: 'h', value: 1, noSuffix: true, key: 'h', future: false, expected: "'n þora" },
    { token: 'h', value: 1, noSuffix: false, key: 'h', future: true, expected: "'n þora" },
    { token: 'h', value: 1, noSuffix: true, key: 'h', future: true, expected: "'n þora" },
    { token: 'hh', value: 1, noSuffix: false, key: 'hh', future: false, expected: '1 þoras' },
    { token: 'hh', value: 11, noSuffix: true, key: 'hh', future: false, expected: '11 þoras' },
    { token: 'hh', value: 1, noSuffix: false, key: 'hh', future: true, expected: '1 þoras' },
    { token: 'hh', value: 11, noSuffix: true, key: 'hh', future: true, expected: '11 þoras' },
    { token: 'd', value: 1, noSuffix: false, key: 'd', future: false, expected: "'iensa ziua" },
    { token: 'd', value: 1, noSuffix: true, key: 'd', future: false, expected: "'n ziua" },
    { token: 'd', value: 1, noSuffix: false, key: 'd', future: true, expected: "'n ziua" },
    { token: 'd', value: 1, noSuffix: true, key: 'd', future: true, expected: "'n ziua" },
    { token: 'dd', value: 4, noSuffix: false, key: 'dd', future: false, expected: '4 ziuas' },
    { token: 'dd', value: 4, noSuffix: true, key: 'dd', future: false, expected: '4 ziuas' },
    { token: 'dd', value: 4, noSuffix: false, key: 'dd', future: true, expected: '4 ziuas' },
    { token: 'dd', value: 4, noSuffix: true, key: 'dd', future: true, expected: '4 ziuas' },
    { token: 'M', value: 1, noSuffix: false, key: 'M', future: false, expected: "'iens mes" },
    { token: 'M', value: 1, noSuffix: true, key: 'M', future: false, expected: "'n mes" },
    { token: 'M', value: 1, noSuffix: false, key: 'M', future: true, expected: "'n mes" },
    { token: 'M', value: 1, noSuffix: true, key: 'M', future: true, expected: "'n mes" },
    { token: 'MM', value: 1, noSuffix: false, key: 'MM', future: false, expected: '1 mesen' },
    { token: 'MM', value: 1, noSuffix: true, key: 'MM', future: false, expected: '1 mesen' },
    { token: 'MM', value: 1, noSuffix: false, key: 'MM', future: true, expected: '1 mesen' },
    { token: 'MM', value: 1, noSuffix: true, key: 'MM', future: true, expected: '1 mesen' },
    { token: 'y', value: 1, noSuffix: false, key: 'y', future: false, expected: "'iens ar" },
    { token: 'y', value: 1, noSuffix: true, key: 'y', future: false, expected: "'n ar" },
    { token: 'y', value: 1, noSuffix: false, key: 'y', future: true, expected: "'n ar" },
    { token: 'y', value: 1, noSuffix: true, key: 'y', future: true, expected: "'n ar" },
    { token: 'yy', value: 1, noSuffix: false, key: 'yy', future: false, expected: '1 ars' },
    { token: 'yy', value: 1, noSuffix: true, key: 'yy', future: false, expected: '1 ars' },
    { token: 'yy', value: 1, noSuffix: false, key: 'yy', future: true, expected: '1 ars' },
    { token: 'yy', value: 1, noSuffix: true, key: 'yy', future: true, expected: '1 ars' },
  ])(
    'should format relativeTime for "$token" with "$value", "$key", "$noSuffix", "$future"',
    ({ token, value, noSuffix, key, future, expected }) => {
      const tokenKey = token as keyof RelativeTimeElementFunction
      const rtFunction: RelativeTimeElementFunction = locale.relativeTime[tokenKey]

      expect(rtFunction(value, noSuffix, key, future)).toBe(expected)
    },
  )

  it('should have a method named "meridiem"', () => {
    expect(locale.meridiem).toBeDefined()
    expect(locale.meridiem).toBeTypeOf('function')
    expect(locale.meridiem(10, 0, false)).toBe("D'A")
    expect(locale.meridiem(10, 0, true)).toBe("d'a")
    expect(locale.meridiem(20, 0, false)).toBe("D'O")
    expect(locale.meridiem(20, 0, true)).toBe("d'o")
  })
})
