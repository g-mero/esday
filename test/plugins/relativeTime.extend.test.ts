import { esday } from 'esday'
import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { C } from '~/common'
import localeAr from '~/locales/ar'
import localeEn from '~/locales/en'
import localeFr from '~/locales/fr'
import type { Threshold } from '~/plugins'
import { localePlugin, relativeTimePlugin, utcPlugin } from '~/plugins'
import { expectSame } from '../util'

esday.extend(localePlugin).extend(utcPlugin)
esday.registerLocale(localeEn).registerLocale(localeFr).registerLocale(localeAr)

// Use custom options in .register(relativeTimePlugin, option)
// The modified threshold results in fractional difference between source and reference
const options = {
  thresholds: [
    { key: 's', thresholdValue: 44 },
    { key: 'ss', thresholdValue: 43, thresholdUnit: C.SECOND },
    { key: 'm', thresholdValue: 89, thresholdUnit: C.SECOND },
    { key: 'mm', thresholdValue: 44, thresholdUnit: C.MIN },
    { key: 'h', thresholdValue: 89, thresholdUnit: C.MIN },
    { key: 'hh', thresholdValue: 21, thresholdUnit: C.HOUR },
    { key: 'd', thresholdValue: 1, thresholdUnit: C.DAY }, // modified threshold
    { key: 'dd', thresholdValue: 25, thresholdUnit: C.DAY },
    { key: 'M', thresholdValue: 45, thresholdUnit: C.DAY },
    { key: 'MM', thresholdValue: 10, thresholdUnit: C.MONTH },
    { key: 'y', thresholdValue: 17, thresholdUnit: C.MONTH },
    { key: 'yy', thresholdUnit: C.YEAR },
  ] as Threshold[],
}
esday.extend(relativeTimePlugin, options)

describe('relativeTime plugin - custom thresholds', () => {
  const fakeTimeAsString = '2023-12-17T03:24:46.234'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))

    // set global locale
    esday.locale('en')
    // we do not have to call 'moment.locale('en')' as this is the default locale
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it.each([
    {
      difference: 40,
      unit: C.SECOND,
    },
    {
      difference: 23,
      unit: C.HOUR,
    },
  ])(
    'should handle fractional difference "$difference $unit" in the past',
    ({ difference, unit }) => {
      expectSame((esday) => esday().from(esday().add(difference, unit)))
    },
  )

  it.each([
    {
      difference: 23,
      unit: C.HOUR,
    },
  ])(
    'should handle fractional difference "$difference $unit" in the future',
    ({ difference, unit }) => {
      expectSame((esday) => esday().from(esday().subtract(difference, unit)))
    },
  )
})
