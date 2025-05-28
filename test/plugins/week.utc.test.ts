import { esday } from 'esday'
import moment from 'moment/min/moment-with-locales'
import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import localeDe from '~/locales/de'
import localeEn from '~/locales/en'
import { advancedParsePlugin, localePlugin, utcPlugin, weekPlugin } from '~/plugins'
import { expectSameResult } from '../util'

esday.extend(utcPlugin).extend(localePlugin).extend(advancedParsePlugin).extend(weekPlugin)

esday.registerLocale(localeEn)
esday.registerLocale(localeDe)

describe('week plugin - locale en', () => {
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
    { sourceString: '2025-10-24 2', formatString: 'YYYY-MM-DD w' },
    { sourceString: '2025 2', formatString: 'YYYY w' },
    { sourceString: '2025 02', formatString: 'YYYY w' },
    { sourceString: '2025 02', formatString: 'YYYY ww' },
    { sourceString: '2025 12', formatString: 'YYYY ww' },
  ])(
    'should parse "$sourceString" with week token in "$formatString"',
    ({ sourceString, formatString }) => {
      expectSameResult((esday) => esday.utc(sourceString, formatString))
    },
  )

  it.each([
    { sourceString: '2025-10-24 2', formatString: 'YYYY-MM-DD e' },
    { sourceString: '2025 0', formatString: 'YYYY e' },
    { sourceString: '2025 1', formatString: 'YYYY e' },
    { sourceString: '2025 2', formatString: 'YYYY e' },
    { sourceString: '2025 3', formatString: 'YYYY e' },
    { sourceString: '2025 4', formatString: 'YYYY e' },
    { sourceString: '2025 5', formatString: 'YYYY e' },
    { sourceString: '2025 6', formatString: 'YYYY e' },
  ])(
    'parse "$sourceString" with weekday token in "$formatString"',
    ({ sourceString, formatString }) => {
      expectSameResult((esday) => esday.utc(sourceString, formatString))
    },
  )

  it.each([
    { sourceString: '24', formatString: 'gg' },
    { sourceString: '2024', formatString: 'gg' },
    { sourceString: '2025 2', formatString: 'gg M' },
    { sourceString: '25-10-24', formatString: 'gg-MM-DD' },
    { sourceString: '2025-10-24', formatString: 'gg-MM-DD' },
    { sourceString: '25 22', formatString: 'gg DD' },
    { sourceString: '2025 22', formatString: 'gg DD' },
    { sourceString: '22 2025', formatString: 'ww gg' },
    { sourceString: '22 25', formatString: 'ww gg' },
    { sourceString: '2025 22 4', formatString: 'gg ww e' },
    { sourceString: '2020', formatString: 'gggg' },
    { sourceString: '2024', formatString: 'gggg' },
    { sourceString: '2025 2', formatString: 'gggg M' },
    { sourceString: '2025 06-24', formatString: 'gggg MM-DD' },
    { sourceString: '2025-10-24', formatString: 'gggg-MM-DD' },
    { sourceString: '2025 22', formatString: 'gggg DD' },
    { sourceString: '22 2025', formatString: 'ww gggg' },
    { sourceString: '2025 22 4', formatString: 'gggg ww e' },
  ])(
    'should parse "$sourceString" with weekYear token in "$formatString"',
    ({ sourceString, formatString }) => {
      expectSameResult((esday) => esday.utc(sourceString, formatString))
    },
  )
})

describe('week plugin - locale de', () => {
  const fakeTimeAsString = '2023-12-18T03:24:46.234'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))

    // set global locale
    esday.locale('de')
    moment.locale('de')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it.each([
    { sourceString: '2025-10-24 2', formatString: 'YYYY-MM-DD w' },
    { sourceString: '2025 2', formatString: 'YYYY w' },
    { sourceString: '2025 02', formatString: 'YYYY w' },
    { sourceString: '2025 02', formatString: 'YYYY ww' },
    { sourceString: '2025 12', formatString: 'YYYY ww' },
  ])(
    'should parse "$sourceString" with week token in "$formatString"',
    ({ sourceString, formatString }) => {
      expectSameResult((esday) => esday.utc(sourceString, formatString))
    },
  )

  it.each([
    { sourceString: '2025-10-24 2', formatString: 'YYYY-MM-DD e' },
    { sourceString: '2025 0', formatString: 'YYYY e' },
    { sourceString: '2025 1', formatString: 'YYYY e' },
    { sourceString: '2025 2', formatString: 'YYYY e' },
    { sourceString: '2025 3', formatString: 'YYYY e' },
    { sourceString: '2025 4', formatString: 'YYYY e' },
    { sourceString: '2025 5', formatString: 'YYYY e' },
    { sourceString: '2025 6', formatString: 'YYYY e' },
  ])(
    'parse "$sourceString" with weekday token in "$formatString"',
    ({ sourceString, formatString }) => {
      expectSameResult((esday) => esday.utc(sourceString, formatString))
    },
  )

  it.each([
    { sourceString: '24', formatString: 'gg' },
    { sourceString: '2024', formatString: 'gg' },
    { sourceString: '2025 2', formatString: 'gg M' },
    { sourceString: '25-10-24', formatString: 'gg-MM-DD' },
    { sourceString: '2025-10-24', formatString: 'gg-MM-DD' },
    { sourceString: '25 22', formatString: 'gg DD' },
    { sourceString: '2025 22', formatString: 'gg DD' },
    { sourceString: '22 2025', formatString: 'ww gg' },
    { sourceString: '22 25', formatString: 'ww gg' },
    { sourceString: '2025 22 4', formatString: 'gg ww e' },
    { sourceString: '2020', formatString: 'gggg' },
    { sourceString: '2024', formatString: 'gggg' },
    { sourceString: '2025 2', formatString: 'gggg M' },
    { sourceString: '2025 06-24', formatString: 'gggg MM-DD' },
    { sourceString: '2025-10-24', formatString: 'gggg-MM-DD' },
    { sourceString: '2025 22', formatString: 'gggg DD' },
    { sourceString: '22 2025', formatString: 'ww gggg' },
    { sourceString: '2025 22 4', formatString: 'gggg ww e' },
  ])(
    'should parse "$sourceString" with weekYear token in "$formatString"',
    ({ sourceString, formatString }) => {
      expectSameResult((esday) => esday.utc(sourceString, formatString))
    },
  )
})
