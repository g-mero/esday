import { esday } from 'esday'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { C } from '~/common'
import localeAr from '~/locales/ar'
import localeEn from '~/locales/en'
import localeFr from '~/locales/fr'
import localePlugin from '~/plugins/locale'
import relativeTimePlugin, { type ThresholdRelativeTime } from '~/plugins/relativeTime'
import utcPlugin from '~/plugins/utc'

esday.extend(localePlugin).extend(utcPlugin)
esday.registerLocale(localeEn).registerLocale(localeFr).registerLocale(localeAr)

// Use custom options in .register(relativeTimePlugin, option)
// The modified threshold results in fractional difference between source and reference
const options = {
  thresholds: {
    ss: 44,
    s: 45,
    m: 50, // modified; default: 45
    h: 22,
    d: 26,
    w: null,
    M: 11,
  } as ThresholdRelativeTime,
}
esday.extend(relativeTimePlugin, options)

describe('relativeTime plugin - custom thresholds', () => {
  const fakeTimeAsString = '2023-12-17T03:24:46.234'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))

    // set global locale
    esday.locale('en')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it.each([
    { difference: 44, unit: C.MIN, expected: '44 minutes ago' },
    { difference: 45, unit: C.MIN, expected: '45 minutes ago' },
    { difference: 49, unit: C.MIN, expected: '49 minutes ago' },
    { difference: 50, unit: C.MIN, expected: 'an hour ago' },
  ])(
    'should handle fractional difference "$difference $unit" in the past',
    ({ difference, unit, expected }) => {
      expect(esday().from(esday().add(difference, unit))).toBe(expected)
    },
  )

  it.each([
    { difference: 44, unit: C.MIN, expected: 'in 44 minutes' },
    { difference: 45, unit: C.MIN, expected: 'in 45 minutes' },
    { difference: 49, unit: C.MIN, expected: 'in 49 minutes' },
    { difference: 50, unit: C.MIN, expected: 'in an hour' },
  ])(
    'should handle fractional difference "$difference $unit" in the future',
    ({ difference, unit, expected }) => {
      expect(esday().from(esday().subtract(difference, unit))).toBe(expected)
    },
  )
})
