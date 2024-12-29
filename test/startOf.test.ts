import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DATE, DAY, HOUR, MIN, MONTH, SECOND, WEEK, YEAR } from '~/common/constants'
import { esday } from '~/core'

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
    { unit: DATE, expectedAsString: '2023-11-17T00:00:00.000' },
    { unit: WEEK, expectedAsString: '2023-11-13T00:00:00.000' },
    { unit: HOUR, expectedAsString: '2023-11-17T03:00:00.000' },
    { unit: MIN, expectedAsString: '2023-11-17T03:24:00.000' },
    { unit: SECOND, expectedAsString: '2023-11-17T03:24:46.000' },
  ])('for "$unit"', ({ unit, expectedAsString }) => {
    const resultDate = esday().startOf(unit)

    expect(resultDate.format('YYYY-MM-DDTHH:mm:ss.SSS')).toBe(expectedAsString)
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
    { unit: DATE, expectedAsString: '2023-11-17T23:59:59.999' },
    { unit: WEEK, expectedAsString: '2023-11-19T23:59:59.999' },
    { unit: HOUR, expectedAsString: '2023-11-17T03:59:59.999' },
    { unit: MIN, expectedAsString: '2023-11-17T03:24:59.999' },
    { unit: SECOND, expectedAsString: '2023-11-17T03:24:46.999' },
  ])('for "$unit"', ({ unit, expectedAsString }) => {
    const resultDate = esday().endOf(unit)

    expect(resultDate.format('YYYY-MM-DDTHH:mm:ss.SSS')).toBe(expectedAsString)
  })
})
