// Test for locale 'de-AT'.

import { describe, expect, it } from 'vitest'
import locale from '~/locales/de-at'

describe('locale de-AT', () => {
  it('should have the correct name', () => {
    expect(locale.name).toBe('de-AT')
  })

  it('should have 7 weekday names', () => {
    expect(locale.weekdays).toBeDefined()
    expect(locale.weekdays?.length).toBe(7)
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
    if (typeof locale.months === 'function') {
      expect(locale.months).toBeTypeOf('function')
    }
    else {
      expect(locale.months?.length).toBe(12)
    }
  })

  it('should have 12 short month names', () => {
    expect(locale.monthsShort).toBeDefined()
    if (typeof locale.monthsShort === 'function') {
      expect(locale.monthsShort).toBeTypeOf('function')
    }
    else {
      expect(locale.monthsShort?.length).toBe(12)
    }
  })

  it('should have a method named "ordinal"', () => {
    expect(locale.ordinal).toBeDefined()
    expect(locale.ordinal).toBeTypeOf('function')
  })

  it('should have numeric property named weekStart', () => {
    expect(locale.weekStart).toBeDefined()
    expect(locale.weekStart).toBeTypeOf('number')
    expect(locale.weekStart).toSatisfy((value: number) => (value >= 0) && (value <= 6))
  })

  it('should have numeric property named yearStart', () => {
    expect(locale.yearStart).toBeDefined()
    expect(locale.yearStart).toBeTypeOf('number')
    expect(locale.yearStart).toSatisfy((value: number) => (value >= 1) && (value <= 7))
  })

  it('should have have an object named "formats"', () => {
    expect(locale.formats).toBeDefined()
    expect(locale.formats).toBeTypeOf('object')
    expect(Object.keys(locale.formats ?? {}).length).toBeGreaterThan(0)
  })

  it('should have an object named "relativeTime"', () => {
    expect(locale.relativeTime).toBeDefined()
    expect(locale.relativeTime).toBeTypeOf('object')
    expect(Object.keys(locale.relativeTime ?? {}).length).toBeGreaterThan(0)
  })

  it('should have a method named "meridiem"', () => {
    expect(locale.meridiem).toBeDefined()
    expect(locale.meridiem).toBeTypeOf('function')
  })
})
