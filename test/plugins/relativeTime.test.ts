import { esday } from 'esday'
import moment from 'moment/min/moment-with-locales'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { C } from '~/common'
import localeAr from '~/locales/ar'
import localeEn from '~/locales/en'
import localeFr from '~/locales/fr'
import {
  type Locale,
  localePlugin,
  type RelativeTimeElementFunction,
  relativeTimePlugin,
  utcPlugin,
} from '~/plugins'
import { expectSame } from '../util'

esday.extend(localePlugin).extend(utcPlugin).extend(relativeTimePlugin)
esday.registerLocale(localeEn).registerLocale(localeFr).registerLocale(localeAr)

describe('relativeTime plugin - without locale', () => {
  const fakeTimeAsString = '2023-12-17T03:24:46.234'
  const targeTimeAsString = '2024-08-14T12:00:00.000Z'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('basic usage', () => {
    expectSame((esday) => esday().fromNow())
    expectSame((esday) => esday().fromNow(true))
    expectSame((esday) => esday().toNow())
    expectSame((esday) => esday().toNow(true))
    expectSame((esday) => esday().from(targeTimeAsString))
    expectSame((esday) => esday().from(targeTimeAsString, true))
    expectSame((esday) => esday().to(targeTimeAsString))
    expectSame((esday) => esday().to(targeTimeAsString, true))
  })

  it('invalid input', () => {
    expectSame((esday) => esday(C.INVALID_DATE).fromNow().toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).toNow().toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).from(targeTimeAsString).toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).to(targeTimeAsString).toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).fromNow(true).toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).toNow(true).toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).from(targeTimeAsString, true).toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).to(targeTimeAsString, true).toLowerCase())
  })

  it('should accept function as "future"', () => {
    const inTheFuture = 'in the future'
    esday.registerLocale({
      name: 'test',
      relativeTime: {
        future: (
          _timeValue: string | number,
          _withoutSuffix: boolean,
          _token: string,
          _isFuture: boolean,
        ) => inTheFuture,
        MM: '%d months',
      },
    } as Locale)
    const sourceDate = '2023-12-17T03:24:46.234Z'
    const referenceDate = '2024-08-14T12:00:00.000Z'
    const testDate = esday(sourceDate).locale('test')

    expect(testDate.to(referenceDate)).toBe('in the future')
  })

  it('should accept function as "past"', () => {
    const inThePast = 'in the past'
    esday.registerLocale({
      name: 'test',
      relativeTime: {
        past: (
          _timeValue: string | number,
          _withoutSuffix: boolean,
          _token: string,
          _isFuture: boolean,
        ) => inThePast,
        MM: '%d months',
      },
    } as Locale)
    const sourceDate = '2023-12-17T03:24:46.234Z'
    const referenceDate = '2024-08-14T12:00:00.000Z'
    const testDate = esday(sourceDate).locale('test')

    expect(testDate.from(referenceDate)).toBe('in the past')
  })

  it.each([
    {
      difference: 44,
      unit: C.SECOND,
      expected: 'key=s - value=44 ago',
    },
    {
      difference: 89,
      unit: C.SECOND,
      expected: 'key=m - value=1 ago',
    },
    {
      difference: 44,
      unit: C.MIN,
      expected: 'key=mm - value=44 ago',
    },
    {
      difference: 89,
      unit: C.MIN,
      expected: 'key=h - value=1 ago',
    },
    {
      difference: 21,
      unit: C.HOUR,
      expected: 'key=hh - value=21 ago',
    },
    {
      difference: 35,
      unit: C.HOUR,
      expected: 'key=d - value=1 ago',
    },
    {
      difference: 25,
      unit: C.DAY,
      expected: 'key=dd - value=25 ago',
    },
    {
      difference: 45,
      unit: C.DAY,
      expected: 'key=M - value=1 ago',
    },
    {
      difference: 10,
      unit: C.MONTH,
      expected: 'key=MM - value=10 ago',
    },
    {
      difference: 17,
      unit: C.MONTH,
      expected: 'key=y - value=1 ago',
    },
    {
      difference: 2,
      unit: C.YEAR,
      expected: 'key=yy - value=2 ago',
    },
  ])(
    'should accept function for "$difference $unit" in the past',
    ({ difference, unit, expected }) => {
      const formatter: RelativeTimeElementFunction = (
        timeValue: string | number,
        _withoutSuffix: boolean,
        token: string,
        _isFuture: boolean,
      ) => `key=${token} - value=${timeValue}`
      esday.registerLocale({
        name: 'test',
        relativeTime: {
          future: 'in %s',
          past: '%s ago',
          s: formatter,
          ss: formatter,
          m: formatter,
          mm: formatter,
          h: formatter,
          hh: formatter,
          d: formatter,
          dd: formatter,
          M: formatter,
          MM: formatter,
          y: formatter,
          yy: formatter,
        },
      } as Locale)
      const testDate = esday().locale('test')
      const referenceDate = testDate.add(difference, unit)

      expect(testDate.from(referenceDate)).toBe(expected)
    },
  )

  it.each([
    {
      difference: 44,
      unit: C.SECOND,
      expected: 'in key=s - value=44',
    },
    {
      difference: 89,
      unit: C.SECOND,
      expected: 'in key=m - value=1',
    },
    {
      difference: 44,
      unit: C.MIN,
      expected: 'in key=mm - value=44',
    },
    {
      difference: 89,
      unit: C.MIN,
      expected: 'in key=h - value=1',
    },
    {
      difference: 21,
      unit: C.HOUR,
      expected: 'in key=hh - value=21',
    },
    {
      difference: 35,
      unit: C.HOUR,
      expected: 'in key=d - value=1',
    },
    {
      difference: 25,
      unit: C.DAY_OF_MONTH,
      expected: 'in key=dd - value=25',
    },
    {
      difference: 45,
      unit: C.DAY_OF_MONTH,
      expected: 'in key=M - value=1',
    },
    {
      difference: 10,
      unit: C.MONTH,
      expected: 'in key=MM - value=10',
    },
    {
      difference: 17,
      unit: C.MONTH,
      expected: 'in key=y - value=1',
    },
    {
      difference: 2,
      unit: C.YEAR,
      expected: 'in key=yy - value=2',
    },
  ])(
    'should accept function for "$difference $unit" in the future',
    ({ difference, unit, expected }) => {
      const formatter: RelativeTimeElementFunction = (
        timeValue: string | number,
        _withoutSuffix: boolean,
        token: string,
        _isFuture: boolean,
      ) => `key=${token} - value=${timeValue}`
      esday.registerLocale({
        name: 'test',
        relativeTime: {
          future: 'in %s',
          past: '%s ago',
          s: formatter,
          ss: formatter,
          m: formatter,
          mm: formatter,
          h: formatter,
          hh: formatter,
          d: formatter,
          dd: formatter,
          M: formatter,
          MM: formatter,
          y: formatter,
          yy: formatter,
        },
      } as Locale)
      const testDate = esday().locale('test')
      const referenceDate = testDate.subtract(difference, unit)

      expect(testDate.from(referenceDate)).toBe(expected)
    },
  )

  it('should accept fractional difference', () => {
    expectSame((esday) => esday().from(esday().add(36.1, C.HOUR)))
  })
})

describe('relativeTime plugin - locale without relativeTime', () => {
  it('should use default relativeTime definitions', () => {
    esday.registerLocale({
      name: 'test',
    } as Locale)
    const sourceDate = '2023-12-17T03:24:46.234Z'
    const referenceDate = '2024-08-14T12:00:00.000Z'
    const testDate = esday(sourceDate).locale('test')

    expect(testDate.to(referenceDate)).toBe('in 8 months')
  })
})

describe('relativeTime plugin - utc', () => {
  const fakeTimeAsString = '2023-12-17T03:24:46.234'
  const targeTimeAsString = '2024-08-14T12:00:00.000Z'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fromNow with suffix', () => {
    expectSame((esday) => esday.utc().fromNow())
  })

  it('fromNow without suffix', () => {
    expectSame((esday) => esday.utc().fromNow(true))
  })

  it('toNow with suffix', () => {
    expectSame((esday) => esday.utc().toNow())
  })

  it('toNow without suffix', () => {
    expectSame((esday) => esday.utc().toNow(true))
  })

  it('from with suffix', () => {
    expectSame((esday) => esday.utc().from(targeTimeAsString))
  })

  it('from without suffix', () => {
    expectSame((esday) => esday.utc().from(targeTimeAsString, true))
  })

  it('to with suffix', () => {
    expectSame((esday) => esday.utc().to(targeTimeAsString))
  })

  it('to without suffix', () => {
    expectSame((esday) => esday.utc().to(targeTimeAsString, true))
  })
})

describe('relativeTime plugin - locale en', () => {
  const fakeTimeAsString = '2023-12-17T03:24:46.234'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))

    // set global locale
    esday.locale('en')
    moment.locale('en')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it.each([
    {
      sourceDate: '2023-12-17T03:24:46.234',
      referenceDate: 'targeTimeAsString',
      withoutSuffix: false,
    },
    {
      sourceDate: '2023-12-17T03:24:46.234',
      referenceDate: 'targeTimeAsString',
      withoutSuffix: true,
    },
  ])(
    'from "$sourceDate" to "$referenceDate" withoutSuffix="$withoutSuffix"',
    ({ sourceDate, referenceDate, withoutSuffix }) => {
      expectSame((esday) => esday(sourceDate).from(referenceDate, withoutSuffix))
    },
  )

  it.each([
    {
      sourceDate: '2023-12-17T03:24:46.234',
      referenceDate: 'targeTimeAsString',
      withoutSuffix: false,
    },
    {
      sourceDate: '2023-12-17T03:24:46.234',
      referenceDate: 'targeTimeAsString',
      withoutSuffix: true,
    },
  ])(
    'to "$sourceDate" from "$referenceDate" withoutSuffix="$withoutSuffix"',
    ({ sourceDate, referenceDate, withoutSuffix }) => {
      expectSame((esday) => esday(sourceDate).to(referenceDate, withoutSuffix))
    },
  )

  it.each([
    { sourceDate: '2023-12-17T03:24:46.234', withoutSuffix: false },
    { sourceDate: '2023-12-17T03:24:46.234', withoutSuffix: true },
  ])('fromNow to "$sourceDate" withoutSuffix="$withoutSuffix"', ({ sourceDate, withoutSuffix }) => {
    expectSame((esday) => esday(sourceDate).fromNow(withoutSuffix))
  })

  it.each([
    { sourceDate: '2023-12-17T03:24:46.234', withoutSuffix: false },
    { sourceDate: '2023-12-17T03:24:46.234', withoutSuffix: true },
  ])('toNow from "$sourceDate" withoutSuffix="$withoutSuffix"', ({ sourceDate, withoutSuffix }) => {
    expectSame((esday) => esday(sourceDate).toNow(withoutSuffix))
  })

  it.each([
    {
      difference: 44,
      unit: C.SECOND,
    },
    {
      difference: 89,
      unit: C.SECOND,
    },
    {
      difference: 44,
      unit: C.MIN,
    },
    {
      difference: 89,
      unit: C.MIN,
    },
    {
      difference: 21,
      unit: C.HOUR,
    },
    {
      difference: 35,
      unit: C.HOUR,
    },
    {
      difference: 25,
      unit: C.DAY,
    },
    {
      difference: 45,
      unit: C.DAY,
    },
    {
      difference: 10,
      unit: C.MONTH,
    },
    {
      difference: 17,
      unit: C.MONTH,
    },
    {
      difference: 2,
      unit: C.YEAR,
    },
  ])('should accept function for "$difference $unit" in the past', ({ difference, unit }) => {
    expectSame((esday) => esday().from(esday().add(difference, unit)))
  })

  it.each([
    {
      difference: 44,
      unit: C.SECOND,
    },
    {
      difference: 89,
      unit: C.SECOND,
    },
    {
      difference: 44,
      unit: C.MIN,
    },
    {
      difference: 89,
      unit: C.MIN,
    },
    {
      difference: 21,
      unit: C.HOUR,
    },
    {
      difference: 35,
      unit: C.HOUR,
    },
    {
      difference: 25,
      unit: C.DAY,
    },
    {
      difference: 45,
      unit: C.DAY,
    },
    {
      difference: 10,
      unit: C.MONTH,
    },
    {
      difference: 17,
      unit: C.MONTH,
    },
    {
      difference: 2,
      unit: C.YEAR,
    },
  ])('should accept function for "$difference $unit" in the future', ({ difference, unit }) => {
    expectSame((esday) => esday().from(esday().subtract(difference, unit)))
  })
})

describe('relativeTime plugin - locale fr', () => {
  const fakeTimeAsString = '2023-12-17T03:24:46.234'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))

    // set global locale
    esday.locale('fr')
    moment.locale('fr')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it.each([
    {
      sourceDate: '2023-12-17T03:24:46.234',
      referenceDate: 'targeTimeAsString',
      withoutSuffix: false,
    },
    {
      sourceDate: '2023-12-17T03:24:46.234',
      referenceDate: 'targeTimeAsString',
      withoutSuffix: true,
    },
  ])(
    'from "$sourceDate" to "$referenceDate" withoutSuffix="$withoutSuffix"',
    ({ sourceDate, referenceDate, withoutSuffix }) => {
      expectSame((esday) => esday(sourceDate).from(referenceDate, withoutSuffix))
    },
  )

  it.each([
    {
      sourceDate: '2023-12-17T03:24:46.234',
      referenceDate: 'targeTimeAsString',
      withoutSuffix: false,
    },
    {
      sourceDate: '2023-12-17T03:24:46.234',
      referenceDate: 'targeTimeAsString',
      withoutSuffix: true,
    },
  ])(
    'to "$sourceDate" from "$referenceDate" withoutSuffix="$withoutSuffix"',
    ({ sourceDate, referenceDate, withoutSuffix }) => {
      expectSame((esday) => esday(sourceDate).to(referenceDate, withoutSuffix))
    },
  )

  it.each([
    { sourceDate: '2023-12-17T03:24:46.234', withoutSuffix: false },
    { sourceDate: '2023-12-17T03:24:46.234', withoutSuffix: true },
  ])('fromNow to "$sourceDate" withoutSuffix="$withoutSuffix"', ({ sourceDate, withoutSuffix }) => {
    expectSame((esday) => esday(sourceDate).fromNow(withoutSuffix))
  })

  it.each([
    { sourceDate: '2023-12-17T03:24:46.234', withoutSuffix: false },
    { sourceDate: '2023-12-17T03:24:46.234', withoutSuffix: true },
  ])('toNow from "$sourceDate" withoutSuffix="$withoutSuffix"', ({ sourceDate, withoutSuffix }) => {
    expectSame((esday) => esday(sourceDate).toNow(withoutSuffix))
  })
})

describe('relativeTime plugin - locale ar', () => {
  const fakeTimeAsString = '2023-12-17T03:24:46.234'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))

    // set global locale
    esday.locale('ar')
    moment.locale('ar')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it.each([
    {
      difference: 44,
      unit: C.SECOND,
    },
    {
      difference: 89,
      unit: C.SECOND,
    },
    {
      difference: 44,
      unit: C.MIN,
    },
    {
      difference: 89,
      unit: C.MIN,
    },
    {
      difference: 21,
      unit: C.HOUR,
    },
    {
      difference: 35,
      unit: C.HOUR,
    },
    {
      difference: 25,
      unit: C.DAY,
    },
    {
      difference: 45,
      unit: C.DAY,
    },
    {
      difference: 10,
      unit: C.MONTH,
    },
    {
      difference: 17,
      unit: C.MONTH,
    },
    {
      difference: 2,
      unit: C.YEAR,
    },
  ])('should accept function for "$difference $unit" in the past', ({ difference, unit }) => {
    expectSame((esday) => esday().from(esday().add(difference, unit)))
  })

  it.each([
    {
      difference: 44,
      unit: C.SECOND,
    },
    {
      difference: 89,
      unit: C.SECOND,
    },
    {
      difference: 44,
      unit: C.MIN,
    },
    {
      difference: 89,
      unit: C.MIN,
    },
    {
      difference: 21,
      unit: C.HOUR,
    },
    {
      difference: 35,
      unit: C.HOUR,
    },
    {
      difference: 25,
      unit: C.DAY,
    },
    {
      difference: 45,
      unit: C.DAY,
    },
    {
      difference: 10,
      unit: C.MONTH,
    },
    {
      difference: 17,
      unit: C.MONTH,
    },
    {
      difference: 2,
      unit: C.YEAR,
    },
  ])('should accept function for "$difference $unit" in the future', ({ difference, unit }) => {
    expectSame((esday) => esday().from(esday().subtract(difference, unit)))
  })
})
