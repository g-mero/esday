import moment from 'moment'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DATE_OF_WEEK, DAY, HOUR, MIN, MONTH, SECOND, WEEK, YEAR } from '~/common/constants'
import { esday } from '~/core'
import { expectSameResult } from './util'

//make the default moment locale use the required settings compatible
// with ISO 8601, as in vitest browser mode we cannot load a moment
// locale in the head element.
moment.updateLocale('en', {
  week: {
    dow: 1, // First day of week is Monday
    doy: 4, // First week of year must contain 4 January (7 + 1 - 4)
  },
})

describe('startOf', () => {
  // => format uses null as offset
  const fakeTimeAsString = '2023-11-17T03:24:46.234'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // First day of the week is calculated for the locales starting a week on Monday
  it.each([
    { unit: YEAR, expectedAsString: '2023-01-01T00:00:00.000' },
    { unit: MONTH, expectedAsString: '2023-11-01T00:00:00.000' },
    { unit: DAY, expectedAsString: '2023-11-17T00:00:00.000' },
    { unit: DATE_OF_WEEK, expectedAsString: '2023-11-17T00:00:00.000' },
    { unit: WEEK, expectedAsString: '2023-11-13T00:00:00.000' },
    { unit: HOUR, expectedAsString: '2023-11-17T03:00:00.000' },
    { unit: MIN, expectedAsString: '2023-11-17T03:24:00.000' },
    { unit: SECOND, expectedAsString: '2023-11-17T03:24:46.000' },
  ])('for "$unit"', ({ unit, expectedAsString }) => {
    const resultDate = esday().startOf(unit)

    expect(resultDate.format('YYYY-MM-DDTHH:mm:ss.SSS')).toBe(expectedAsString)
  })

  it.each([
    { sourceString: '2024-01-01T00:00:00' },
    { sourceString: '2023-12-31T00:00:00' },
    { sourceString: '2023-11-12T00:00:00' },
    { sourceString: '2023-11-13T00:00:00' },
    { sourceString: '2023-11-14T00:00:00' },
    { sourceString: '2023-05-07T00:00:00' },
  ])('for edge case "$sourceString"', ({ sourceString }) => {
    expectSameResult((esday) => esday(sourceString).startOf(WEEK))
  })
})

describe('endOf', () => {
  const fakeTimeAsString = '2023-11-17T03:24:46.234'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it.each([
    { unit: YEAR, expectedAsString: '2023-12-31T23:59:59.999' },
    { unit: MONTH, expectedAsString: '2023-11-30T23:59:59.999' },
    { unit: DAY, expectedAsString: '2023-11-17T23:59:59.999' },
    { unit: DATE_OF_WEEK, expectedAsString: '2023-11-17T23:59:59.999' },
    { unit: WEEK, expectedAsString: '2023-11-19T23:59:59.999' },
    { unit: HOUR, expectedAsString: '2023-11-17T03:59:59.999' },
    { unit: MIN, expectedAsString: '2023-11-17T03:24:59.999' },
    { unit: SECOND, expectedAsString: '2023-11-17T03:24:46.999' },
  ])('for "$unit"', ({ unit, expectedAsString }) => {
    const resultDate = esday().endOf(unit)

    expect(resultDate.format('YYYY-MM-DDTHH:mm:ss.SSS')).toBe(expectedAsString)
  })

  it.each([
    { sourceString: '2024-01-01T00:00:00' },
    { sourceString: '2023-12-31T00:00:00' },
    { sourceString: '2023-11-12T00:00:00' },
    { sourceString: '2023-11-13T00:00:00' },
    { sourceString: '2023-11-14T00:00:00' },
    { sourceString: '2023-05-07T00:00:00' },
  ])('for edge case "$sourceString"', ({ sourceString }) => {
    expectSameResult((esday) => esday(sourceString).endOf(WEEK))
  })
})
