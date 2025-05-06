import { esday } from 'esday'
import moment from 'moment/min/moment-with-locales'
import { beforeEach, describe, expect, it } from 'vitest'
import { C } from '~/common'
import localeEn from '~/locales/en'
import { localePlugin, localizedFormatPlugin, weekPlugin } from '~/plugins'
import { expectSame, expectSameResult } from '../util'

esday.extend(localizedFormatPlugin).extend(localePlugin).extend(weekPlugin)
esday.registerLocale(localeEn)

// Tests with Sunday as start of week
describe('week plugin - locale "en"', () => {
  beforeEach(() => {
    // set global locale
    esday.locale('en')
    // we do not have to call 'moment.locale('en')' as this is the default locale
  })

  it.each([
    { sourceString: '2024-03-29', expected: 13, weekday: 'Friday' },
    { sourceString: '2024-03-30', expected: 13, weekday: 'Saturday' },
    { sourceString: '2024-03-31', expected: 14, weekday: 'Sunday' },
    { sourceString: '2024-04-01', expected: 14, weekday: 'Monday' },
    { sourceString: '2025-04-02', expected: 14, weekday: 'Tuesday' },
    { sourceString: '2024-04-05', expected: 14, weekday: 'Friday' },
    { sourceString: '2024-04-06', expected: 14, weekday: 'Saturday' },
    { sourceString: '2024-04-07', expected: 15, weekday: 'Sunday' },
    { sourceString: '2024-04-08', expected: 15, weekday: 'Monday' },
    { sourceString: '2025-04-09', expected: 15, weekday: 'Tuesday' },
    { sourceString: '2024-06-10', expected: 24, weekday: 'Monday' },
    { sourceString: '2024-06-11', expected: 24, weekday: 'Tuesday' },
    { sourceString: '2024-06-12', expected: 24, weekday: 'Wednesday' },
    { sourceString: '2024-06-13', expected: 24, weekday: 'Thursday' },
    { sourceString: '2024-06-14', expected: 24, weekday: 'Friday' },
    { sourceString: '2024-06-15', expected: 24, weekday: 'Saturday' },
    { sourceString: '2024-06-16', expected: 25, weekday: 'Sunday' },
    { sourceString: '2024-06-17', expected: 25, weekday: 'Monday' },
    { sourceString: '2025-06-18', expected: 25, weekday: 'Tuesday' },
    { sourceString: '2025-06-19', expected: 25, weekday: 'Wednesday' },
    { sourceString: '2025-06-20', expected: 25, weekday: 'Thursday' },
  ])('should return the week number for "$sourceString"', ({ sourceString, expected }) => {
    expect(esday(sourceString).week()).toBe(expected)
    expectSame((esday) => esday(sourceString).week())
  })

  it.each([
    { sourceString: '2024-03-29T07:18:29', expected: 13, weekday: 'Friday' },
    { sourceString: '2024-03-30T07:18:29', expected: 13, weekday: 'Saturday' },
    { sourceString: '2024-03-31T07:18:29', expected: 14, weekday: 'Sunday' },
    { sourceString: '2024-04-01T07:18:29', expected: 14, weekday: 'Monday' },
    { sourceString: '2025-04-02T07:18:29', expected: 14, weekday: 'Tuesday' },
    { sourceString: '2024-04-05T07:18:29', expected: 14, weekday: 'Friday' },
    { sourceString: '2024-04-06T07:18:29', expected: 14, weekday: 'Saturday' },
    { sourceString: '2024-04-07T07:18:29', expected: 15, weekday: 'Sunday' },
    { sourceString: '2024-04-08T07:18:29', expected: 15, weekday: 'Monday' },
    { sourceString: '2025-04-09T07:18:29', expected: 15, weekday: 'Tuesday' },
    { sourceString: '2024-06-10T07:18:29', expected: 24, weekday: 'Monday' },
    { sourceString: '2024-06-11T07:18:29', expected: 24, weekday: 'Tuesday' },
    { sourceString: '2024-06-12T07:18:29', expected: 24, weekday: 'Wednesday' },
    { sourceString: '2024-06-13T07:18:29', expected: 24, weekday: 'Thursday' },
    { sourceString: '2024-06-14T07:18:29', expected: 24, weekday: 'Friday' },
    { sourceString: '2024-06-15T07:18:29', expected: 24, weekday: 'Saturday' },
    { sourceString: '2024-06-16T07:18:29', expected: 25, weekday: 'Sunday' },
    { sourceString: '2024-06-17T07:18:29', expected: 25, weekday: 'Monday' },
    { sourceString: '2025-06-18T07:18:29', expected: 25, weekday: 'Tuesday' },
    { sourceString: '2025-06-19T07:18:29', expected: 25, weekday: 'Wednesday' },
    { sourceString: '2025-06-20T07:18:29', expected: 25, weekday: 'Thursday' },
  ])(
    'should return the week number for "$sourceString" with time part',
    ({ sourceString, expected }) => {
      expect(esday(sourceString).week()).toBe(expected)
      expectSame((esday) => esday(sourceString).week())
    },
  )

  it.each([
    { sourceString: '2022-12-31', expected: 53, weekday: 'Saturday' },
    { sourceString: '2023-01-01', expected: 1, weekday: 'Sunday' },
    { sourceString: '2023-12-31', expected: 1, weekday: 'Sunday' },
    { sourceString: '2024-01-01', expected: 1, weekday: 'Monday' },
    { sourceString: '2024-12-29', expected: 1, weekday: 'Friday' },
    { sourceString: '2024-12-30', expected: 1, weekday: 'Saturday' },
    { sourceString: '2024-12-31', expected: 1, weekday: 'Tuesday' },
    { sourceString: '2025-01-01', expected: 1, weekday: 'Wednesday' },
  ])(
    'should handle year transition correctly for "$sourceString"',
    ({ sourceString, expected }) => {
      expect(esday(sourceString).week()).toBe(expected)
      expectSame((esday) => esday(sourceString).week())
    },
  )

  it('should set the week number and adjust the date', () => {
    const date = esday('2024-06-15')
    const weekNumber = 10
    const adjustedDate = date.week(weekNumber)
    expect(adjustedDate.week()).toBe(weekNumber)
    expect(moment(adjustedDate.toISOString()).week()).toBe(weekNumber)
  })

  it.each([
    { sourceString: '2025-01-05', expected: 0 },
    { sourceString: '2025-12-08', expected: 1 },
    { sourceString: '2025-06-03', expected: 2 },
    { sourceString: '2025-10-01', expected: 3 },
    { sourceString: '2025-10-16', expected: 4 },
    { sourceString: '2025-07-11', expected: 5 },
    { sourceString: '2025-04-12', expected: 6 },
  ])('should get the weekday for "$sourceString"', ({ sourceString, expected }) => {
    expectSame((esday) => esday(sourceString).weekday())
    expect(esday(sourceString).weekday()).toBe(expected)
  })

  it.each([
    { sourceString: '2023-01-01', newWeekday: 0 },
    { sourceString: '2023-01-01', newWeekday: 1 },
    { sourceString: '2023-01-01', newWeekday: 2 },
    { sourceString: '2023-01-01', newWeekday: 3 },
    { sourceString: '2023-01-01', newWeekday: 4 },
    { sourceString: '2023-01-01', newWeekday: 5 },
    { sourceString: '2023-01-01', newWeekday: 6 },
    { sourceString: '2025-05-15', newWeekday: 0 },
    { sourceString: '2025-05-15', newWeekday: 1 },
    { sourceString: '2025-05-15', newWeekday: 2 },
    { sourceString: '2025-05-15', newWeekday: 3 },
    { sourceString: '2025-05-15', newWeekday: 4 },
    { sourceString: '2025-05-15', newWeekday: 5 },
    { sourceString: '2025-05-15', newWeekday: 6 },
  ])(
    'should set the weekday to "$newWeekday" for "$sourceString"',
    ({ sourceString, newWeekday }) => {
      expectSameResult((esday) => esday(sourceString).weekday(newWeekday))
    },
  )

  it.each([
    { sourceString: '2025-01-01', expected: 2025 },
    { sourceString: '2025-12-27', expected: 2025 },
    { sourceString: '2025-12-28', expected: 2026 },
    { sourceString: '2026-12-31', expected: 2027 },
  ])('should get the weekYear for "$sourceString"', ({ sourceString, expected }) => {
    expectSame((esday) => esday(sourceString).weekYear())
    expect(esday(sourceString).weekYear()).toBe(expected)
  })

  it.each([
    { sourceString: '2025-08-20', newIsoYear: 2022, expected: '2022-08-24' },
    { sourceString: '2025-12-31', newIsoYear: 2025, expected: '2025-01-01' },
    { sourceString: '2025-12-31', newIsoYear: 2026, expected: '2025-12-31' },
    { sourceString: '2026-12-31', newIsoYear: 2026, expected: '2026-12-31' },
  ])(
    'should set the weekYear for "$sourceString" to "$newIsoYear"',
    ({ sourceString, newIsoYear }) => {
      expectSameResult((esday) => esday(sourceString).weekYear(newIsoYear))
      expect(esday(sourceString).weekYear(newIsoYear).weekYear()).toBe(newIsoYear)
    },
  )

  // 1st day of week: Sunday; 1st week of year contains January 1st
  it.each([
    { sourceDate: '2016-04-25T00:00:00', expected: 53, weekday: 'Friday' },
    { sourceDate: '2019-04-25T00:00:00', expected: 52, weekday: 'Tuesday' },
    { sourceDate: '2020-04-25T00:00:00', expected: 52, weekday: 'Wednesday' },
    { sourceDate: '2021-04-25T00:00:00', expected: 52, weekday: 'Friday' },
    { sourceDate: '2022-04-25T00:00:00', expected: 53, weekday: 'Saturday' }, // Saturday ********
    { sourceDate: '2023-04-25T00:00:00', expected: 52, weekday: 'Sunday' },
    { sourceDate: '2024-04-25T00:00:00', expected: 52, weekday: 'Monday' },
    { sourceDate: '2025-04-25T00:00:00', expected: 52, weekday: 'Wednesday' },
    { sourceDate: '2026-04-25T00:00:00', expected: 52, weekday: 'Thursday' },
    { sourceDate: '2027-04-25T00:00:00', expected: 52, weekday: 'Friday' },
    { sourceDate: '2028-04-25T00:00:00', expected: 53, weekday: 'Saturday' }, // Saturday ********
    { sourceDate: '2044-04-25T00:00:00', expected: 53, weekday: 'Friday' }, // Friday in leap year ********
  ])('should get the weeksInYear for "$sourceDate"', ({ sourceDate, expected }) => {
    expect(moment(sourceDate).weeksInYear()).toBe(expected)
    expect(esday(sourceDate).weeksInYear()).toBe(expected)
  })

  it.each([
    { sourceString: '2023-11-17T03:24:46.234', expectedAsString: '2023-11-12T00:00:00.000' },
    { sourceString: '2023-11-01T00:00:00.000', expectedAsString: '2023-10-29T00:00:00.000' },
    { sourceString: '2023-01-01T03:24:46.234', expectedAsString: '2023-01-01T00:00:00.000' },
    { sourceString: '2024-01-02T03:24:46.234', expectedAsString: '2023-12-31T00:00:00.000' },
  ])('should get startOf week for "$sourceString"', ({ sourceString, expectedAsString }) => {
    const resultDate = esday(sourceString).startOf(C.WEEK)

    expect(resultDate.format('YYYY-MM-DDTHH:mm:ss.SSS')).toBe(expectedAsString)
    expectSameResult((esday) => esday(sourceString).startOf(C.WEEK))
  })

  it.each([
    { sourceString: '2024-01-01T00:00:00' },
    { sourceString: '2023-12-31T00:00:00' },
    { sourceString: '2023-11-12T00:00:00' },
    { sourceString: '2023-11-13T00:00:00' },
    { sourceString: '2023-11-14T00:00:00' },
    { sourceString: '2023-05-07T00:00:00' },
  ])('should handle edge case for startOf week for "$sourceString"', ({ sourceString }) => {
    expectSameResult((esday) => esday(sourceString).startOf(C.WEEK))
  })

  it.each([
    { sourceString: '2023-11-17T03:24:46.234', expectedAsString: '2023-11-18T23:59:59.999' },
    { sourceString: '2023-10-30T00:00:00.000', expectedAsString: '2023-11-04T23:59:59.999' },
    { sourceString: '2023-01-01T03:24:46.234', expectedAsString: '2023-01-07T23:59:59.999' },
    { sourceString: '2023-12-31T03:24:46.234', expectedAsString: '2024-01-06T23:59:59.999' },
  ])('should get endOf week for "$sourceString"', ({ sourceString, expectedAsString }) => {
    const resultDate = esday(sourceString).endOf(C.WEEK)

    expect(resultDate.format('YYYY-MM-DDTHH:mm:ss.SSS')).toBe(expectedAsString)
    expectSameResult((esday) => esday(sourceString).endOf(C.WEEK))
  })

  it.each([
    { sourceString: '2024-01-01T00:00:00' },
    { sourceString: '2023-12-31T00:00:00' },
    { sourceString: '2023-11-12T00:00:00' },
    { sourceString: '2023-11-13T00:00:00' },
    { sourceString: '2023-11-14T00:00:00' },
    { sourceString: '2023-05-07T00:00:00' },
  ])('should handle edge case for ebdOf week for "$sourceString"', ({ sourceString }) => {
    expectSameResult((esday) => esday(sourceString).endOf(C.WEEK))
  })

  it.each([
    { sourceString: '2024-12-24T14:25:36', formatString: 'w' },
    { sourceString: '2024-12-24T14:25:36', formatString: 'ww' },
    { sourceString: '2024-12-24T14:25:36', formatString: 'wo' },
    { sourceString: '2025-01-01T14:25:36', formatString: 'wo' },
    { sourceString: '2024-12-24T14:25:36', formatString: 'e' },
    { sourceString: '2024-12-24T14:25:36', formatString: 'gg' },
    { sourceString: '2024-12-24T14:25:36', formatString: 'gggg' },
  ])(
    'format date string "$sourceString" with format "$formatString"',
    ({ sourceString, formatString }) => {
      expectSame((esday) => esday(sourceString).format(formatString))
    },
  )
})
