// Test for locale 'fr'.

import { describe, expect, it } from 'vitest'
import localeFr from '~/locales/fr'

describe('locale fr', () => {
  it('should have the correct name', () => {
    expect(localeFr.name).toBe('fr')
  })

  it('should have 7 weekday names', () => {
    expect(localeFr.weekdays).toBeDefined()
    expect(localeFr.weekdays?.length).toBe(7)
  })

  it('should have 7 short weekday names', () => {
    expect(localeFr.weekdaysShort).toBeDefined()
    expect(localeFr.weekdaysShort?.length).toBe(7)
  })

  it('should have 7 minimal weekday names', () => {
    expect(localeFr.weekdaysMin).toBeDefined()
    expect(localeFr.weekdaysMin?.length).toBe(7)
  })

  it('should have 12 month names', () => {
    expect(localeFr.months).toBeDefined()
    if (typeof localeFr.months === 'function') {
      expect(localeFr.months).toBeTypeOf('function')
    }
    else {
      expect(localeFr.months?.length).toBe(12)
    }
  })

  it('should have 12 short month names', () => {
    expect(localeFr.monthsShort).toBeDefined()
    if (typeof localeFr.monthsShort === 'function') {
      expect(localeFr.monthsShort).toBeTypeOf('function')
    }
    else {
      expect(localeFr.monthsShort?.length).toBe(12)
    }
  })

  it('should have a method named "ordinal"', () => {
    expect(localeFr.ordinal).toBeDefined()
    expect(localeFr.ordinal).toBeTypeOf('function')
  })

  it('should have numeric property named weekStart', () => {
    expect(localeFr.weekStart).toBeDefined()
    expect(localeFr.weekStart).toBeTypeOf('number')
    expect(localeFr.weekStart).toSatisfy((value: number) => (value >= 0) && (value <= 6))
  })

  it('should have numeric property named yearStart', () => {
    expect(localeFr.yearStart).toBeDefined()
    expect(localeFr.yearStart).toBeTypeOf('number')
    expect(localeFr.yearStart).toSatisfy((value: number) => (value >= 1) && (value <= 7))
  })

  it('should have have an object named "formats" with 10 properties', () => {
    expect(localeFr.formats).toBeDefined()
    expect(localeFr.formats).toBeTypeOf('object')
    expect(Object.keys(localeFr.formats ?? {})).toHaveLength(10)
  })

  it('should have an object named "relativeTime"', () => {
    expect(localeFr.relativeTime).toBeDefined()
    expect(localeFr.relativeTime).toBeTypeOf('object')
    expect(Object.keys(localeFr.relativeTime ?? {}).length).toBeGreaterThan(0)
  })

  it('should have a method named "meridiem"', () => {
    expect(localeFr.meridiem).toBeDefined()
    expect(localeFr.meridiem).toBeTypeOf('function')
  })
})
