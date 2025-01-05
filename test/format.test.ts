import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { esday } from '~/core'

describe('format', () => {
  const fakeTimeAsString = '2023-12-17T03:24:46.234'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('without parameters', () => {
    const formattedOffset = esday().format('Z')
    expect(esday().format()).toBe(`2023-12-17T03:24:46${formattedOffset}`)
  })

  it.each([
    '',
    'otherString',
  ])(
    'invalid date created from "%s"',
    (value) => {
      expect(esday(value).format()).toBe('Invalid Date')
    },
  )

  it.each([
    { formatString: 'YY', expected: '23' },
    { formatString: 'YYYY', expected: '2023' },
  ])('year as "$formatString"', ({ formatString, expected }) => {
    expect(esday().format(formatString)).toBe(expected)
  })

  it.each([
    { formatString: 'M', expected: '8' },
    { formatString: 'MM', expected: '08' },
  ])('single digit month as "$formatString"', ({ formatString, expected }) => {
    vi.setSystemTime(new Date('2023-08-17T03:24:46.234'))

    expect(esday().format(formatString)).toBe(expected)
  })

  it.each([
    { formatString: 'M', expected: '12' },
    { formatString: 'MM', expected: '12' },
  ])('double digit month as "$formatString"', ({ formatString, expected }) => {
    expect(esday().format(formatString)).toBe(expected)
  })

  it.each([
    { formatString: 'D', expected: '7' },
    { formatString: 'DD', expected: '07' },
  ])('single digit day of month as "$formatString"', ({ formatString, expected }) => {
    vi.setSystemTime(new Date('2023-12-07T03:24:46.234'))

    expect(esday().format(formatString)).toBe(expected)
  })

  it.each([
    { formatString: 'D', expected: '17' },
    { formatString: 'DD', expected: '17' },
  ])(
    'double digit day of month as "$formatString"',
    ({ formatString, expected }) => {
      expect(esday().format(formatString)).toBe(expected)
    },
  )

  it.each([
    { formatString: 'd', expected: '4' },
  ])(
    'day of week (sun - sat) as "%s"',
    ({ formatString, expected }) => {
      vi.setSystemTime(new Date('2023-12-07T03:24:46.234'))

      expect(esday().format(formatString)).toBe(expected)
    },
  )

  it.each([
    { formatString: 'H', expected: '3' },
    { formatString: 'HH', expected: '03' },
  ])('single digit hour as "$formatString"', ({ formatString, expected }) => {
    expect(esday().format(formatString)).toBe(expected)
  })

  it.each([
    { formatString: 'H', expected: '23' },
    { formatString: 'HH', expected: '23' },
  ])('double digit hour as "$formatString"', ({ formatString, expected }) => {
    vi.setSystemTime(new Date('2023-12-17T23:24:46.234'))

    expect(esday().format(formatString)).toBe(expected)
  })

  it.each([
    { dateString: '2018-05-02T00:00:00.000', formatString: 'h', expected: '12' },
    { dateString: '2018-05-02T01:00:00.000', formatString: 'h', expected: '1' },
    { dateString: '2018-05-02T23:00:00.000', formatString: 'h', expected: '11' },
    { dateString: '2018-05-02T00:00:00.000', formatString: 'hh', expected: '12' },
    { dateString: '2018-05-02T01:00:00.000', formatString: 'hh', expected: '01' },
    { dateString: '2018-05-02T23:00:00.000', formatString: 'hh', expected: '11' },
  ])('hour as "$formatString" (12-hour format)', ({ dateString, formatString, expected }) => {
    expect(esday(dateString).format(formatString)).toBe(expected)
  })

  it.each([
    { dateString: '2018-05-02T01:00:00.000', formatString: 'a', expected: 'am' },
    { dateString: '2018-05-02T23:00:00.000', formatString: 'a', expected: 'pm' },
    { dateString: '2018-05-02T01:00:00.000', formatString: 'A', expected: 'AM' },
    { dateString: '2018-05-02T23:00:00.000', formatString: 'A', expected: 'PM' },
  ])('meridians as "$formatString" (12-hour)', ({ dateString, formatString, expected }) => {
    expect(esday(dateString).format(formatString)).toBe(expected)
  })

  it.each([
    { formatString: 'm', expected: '5' },
    { formatString: 'mm', expected: '05' },
  ])('single digit minute as "$formatString"', ({ formatString, expected }) => {
    vi.setSystemTime(new Date('2023-12-17T03:05:46.234'))

    expect(esday().format(formatString)).toBe(expected)
  })

  it.each([
    { formatString: 'm', expected: '24' },
    { formatString: 'mm', expected: '24' },
  ])('double digit minute as "$formatString"', ({ formatString, expected }) => {
    expect(esday().format(formatString)).toBe(expected)
  })

  it.each([
    { formatString: 's', expected: '1' },
    { formatString: 'ss', expected: '01' },
  ])('single digit second as "$formatString"', ({ formatString, expected }) => {
    const date = '2011-11-05T14:48:01.002'

    expect(esday(date).format(formatString)).toBe(expected)
  })

  it.each([
    { formatString: 's', expected: '46' },
    { formatString: 'ss', expected: '46' },
  ])('double digit second as "$formatString"', ({ formatString, expected }) => {
    expect(esday().format(formatString)).toBe(expected)
  })

  it('millisecond as "SSS"', () => {
    expect(esday().format('SSS')).toBe('234')
  })

  it.each([
    { formatString: 'YYYY-MM', expected: '2023-12' },
    { formatString: 'YYYY-MM-DD', expected: '2023-12-17' },
    { formatString: 'YYYY-MM-DD HH', expected: '2023-12-17 03' },
    { formatString: 'YYYY-MM-DD HH:mm', expected: '2023-12-17 03:24' },
    { formatString: 'YYYY-MM-DD HH:mm:ss', expected: '2023-12-17 03:24:46' },
    { formatString: 'YYYY-MM-DD HH:mm:ss.SSS', expected: '2023-12-17 03:24:46.234' },
    { formatString: 'YY-M-D / HH:mm:ss', expected: '23-12-17 / 03:24:46' },
  ])('date and time as "$formatString"', ({ formatString, expected }) => {
    expect(esday().format(formatString)).toBe(expected)
  })

  it('"2000-01-02" using "d H m s" to "0 0 0 0"', () => {
    const sundayDate = '2000-01-02'
    const sundayStr = 'd H m s'

    expect(esday(sundayDate).format(sundayStr)).toBe('0 0 0 0')
  })

  it('current date and time using "Z" to "??"', () => {
    const esdayDate = esday()
    const format = 'Z'

    expect(esdayDate.format(format)).toMatch(/[+-]\d{2}:\d{2}/)
  })

  it('current date and time using "ZZ" to "??"', () => {
    const esdayDate = esday()
    const format = 'ZZ'

    expect(esdayDate.format(format)).toMatch(/[+-]\d{4}/)
  })
})

describe('conversion', () => {
  const fakeTimeAsString = '2023-12-17T03:24:46.234Z'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('to unix timestamp (milliseconds)', () => {
    expect(esday().valueOf()).toBe(1702783486234)
  })

  it('to unix timestamp (seconds)', () => {
    expect(esday().unix()).toBe(1702783486)
  })

  it('toDate', () => {
    const base = esday()
    const jsDate = base.toDate()

    expect(jsDate).toEqual(new Date())
    expect(jsDate.toUTCString()).toBe(base.toString())

    jsDate.setFullYear(1970)
    expect(jsDate.toUTCString()).not.toBe(base.toString())
  })

  it('toJSON with valid date creates ISO8601 format', () => {
    expect(esday().toJSON()).toBe(fakeTimeAsString)
  })

  it('toJSON with invalid date', () => {
    expect(esday('otherString').toJSON()).toBe(null)
  })

  it('toISOString', () => {
    expect(esday().toISOString()).toBe(fakeTimeAsString)
  })
})
