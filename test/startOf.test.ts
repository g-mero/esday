import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { esday } from '~/core'
import { D, DATE, H, M, MIN, S, W, Y } from '~/core/constant'

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

  // First day of the week is calculated for the locales starting a week on Sunday
  it.each([
    { unit: Y, expected: 1672527600000, expectedAsString: '2023-01-01T00:00:00.000' },
    { unit: M, expected: 1698793200000, expectedAsString: '2023-11-01T00:00:00.000' },
    { unit: D, expected: 1700175600000, expectedAsString: '2023-11-17T00:00:00.000' },
    { unit: DATE, expected: 1700175600000, expectedAsString: '2023-11-17T00:00:00.000' },
    { unit: W, expected: 1699743600000, expectedAsString: '2023-11-12T00:00:00.000' },
    { unit: H, expected: 1700186400000, expectedAsString: '2023-11-17T03:00:00.000' },
    { unit: MIN, expected: 1700187840000, expectedAsString: '2023-11-17T03:24:00.000' },
    { unit: S, expected: 1700187886000, expectedAsString: '2023-11-17T03:24:46.000' },
  ])('for "$unit"', ({ unit, expected, expectedAsString }) => {
    const resultDate = esday().startOf(unit)

    expect(resultDate.valueOf()).toBe(expected)
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
    { unit: Y, expected: 1704063599999, expectedAsString: '2023-12-31T23:59:59.999' },
    { unit: M, expected: 1701385199999, expectedAsString: '2023-11-30T23:59:59.999' },
    { unit: D, expected: 1700261999999, expectedAsString: '2023-11-17T23:59:59.999' },
    { unit: DATE, expected: 1700261999999, expectedAsString: '2023-11-17T23:59:59.999' },
    { unit: W, expected: 1700348399999, expectedAsString: '2023-11-18T23:59:59.999' },
    { unit: H, expected: 1700189999999, expectedAsString: '2023-11-17T03:59:59.999' },
    { unit: MIN, expected: 1700187899999, expectedAsString: '2023-11-17T03:24:59.999' },
    { unit: S, expected: 1700187886999, expectedAsString: '2023-11-17T03:24:46.999' },
  ])('for "$unit"', ({ unit, expected, expectedAsString }) => {
    const resultDate = esday().endOf(unit)

    expect(resultDate.valueOf()).toBe(expected)
    expect(resultDate.format('YYYY-MM-DDTHH:mm:ss.SSS')).toBe(expectedAsString)
  })
})
