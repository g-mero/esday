import { esday } from 'esday'
import moment from 'moment'
import { describe, expect, it } from 'vitest'
import localeDe from '~/locales/de'
import { localePlugin, weekOfYearPlugin } from '~/plugins'
import { expectSame } from '../util'

esday.extend(localePlugin).extend(weekOfYearPlugin)
esday.registerLocale(localeDe)
esday.locale('de')

//make the default moment locale use the required settings compatible
// with locale 'de', as in vitest browser mode we cannot load a moment
// locale in the head element.
moment.updateLocale('en', {
  week: {
    dow: 1, // First day of week is Monday
    doy: 4, // First week of year must contain 4 January (7 + 1 - 4)
  },
})

// Tests with Monday as start of week
describe('week plugin - locale "de"', () => {
  it.each([
    { sourceDate: '2024-03-22', expected: 12, weekday: 'Friday' },
    { sourceDate: '2024-03-23', expected: 12, weekday: 'Saturday' },
    { sourceDate: '2024-03-24', expected: 12, weekday: 'Sunday' },
    { sourceDate: '2024-03-25', expected: 13, weekday: 'Monday' },
    { sourceDate: '2025-03-26', expected: 13, weekday: 'Tuesday' },
    { sourceDate: '2024-03-29', expected: 13, weekday: 'Friday' },
    { sourceDate: '2024-03-30', expected: 13, weekday: 'Saturday' },
    { sourceDate: '2024-03-31', expected: 13, weekday: 'Sunday' },
    { sourceDate: '2024-04-01', expected: 14, weekday: 'Monday' },
    { sourceDate: '2025-04-02', expected: 14, weekday: 'Tuesday' },
    { sourceDate: '2024-06-10', expected: 24, weekday: 'Monday' },
    { sourceDate: '2024-06-11', expected: 24, weekday: 'Tuesday' },
    { sourceDate: '2024-06-12', expected: 24, weekday: 'Wednesday' },
    { sourceDate: '2024-06-13', expected: 24, weekday: 'Thursday' },
    { sourceDate: '2024-06-14', expected: 24, weekday: 'Friday' },
    { sourceDate: '2024-06-15', expected: 24, weekday: 'Saturday' },
    { sourceDate: '2024-06-16', expected: 24, weekday: 'Sunday' },
    { sourceDate: '2024-06-17', expected: 25, weekday: 'Monday' },
    { sourceDate: '2025-06-18', expected: 25, weekday: 'Tuesday' },
    { sourceDate: '2025-06-19', expected: 25, weekday: 'Wednesday' },
    { sourceDate: '2025-06-20', expected: 25, weekday: 'Thursday' },
  ])('should return the correct week number for "$sourceDate"', ({ sourceDate, expected }) => {
    expect(esday(sourceDate).week()).toBe(expected)
    expectSame((esday) => esday(sourceDate).week())
  })

  it.each([
    { sourceDate: '2024-03-22T07:18:29', expected: 12, weekday: 'Friday' },
    { sourceDate: '2024-03-23T07:18:29', expected: 12, weekday: 'Saturday' },
    { sourceDate: '2024-03-24T07:18:29', expected: 12, weekday: 'Sunday' },
    { sourceDate: '2024-03-25T07:18:29', expected: 13, weekday: 'Monday' },
    { sourceDate: '2025-03-26T07:18:29', expected: 13, weekday: 'Tuesday' },
    { sourceDate: '2024-03-29T07:18:29', expected: 13, weekday: 'Friday' },
    { sourceDate: '2024-03-30T07:18:29', expected: 13, weekday: 'Saturday' },
    { sourceDate: '2024-03-31T07:18:29', expected: 13, weekday: 'Sunday' },
    { sourceDate: '2024-04-01T07:18:29', expected: 14, weekday: 'Monday' },
    { sourceDate: '2025-04-02T07:18:29', expected: 14, weekday: 'Tuesday' },
    { sourceDate: '2024-06-10T07:18:29', expected: 24, weekday: 'Monday' },
    { sourceDate: '2024-06-11T07:18:29', expected: 24, weekday: 'Tuesday' },
    { sourceDate: '2024-06-12T07:18:29', expected: 24, weekday: 'Wednesday' },
    { sourceDate: '2024-06-13T07:18:29', expected: 24, weekday: 'Thursday' },
    { sourceDate: '2024-06-14T07:18:29', expected: 24, weekday: 'Friday' },
    { sourceDate: '2024-06-15T07:18:29', expected: 24, weekday: 'Saturday' },
    { sourceDate: '2024-06-16T07:18:29', expected: 24, weekday: 'Sunday' },
    { sourceDate: '2024-06-17T07:18:29', expected: 25, weekday: 'Monday' },
    { sourceDate: '2025-06-18T07:18:29', expected: 25, weekday: 'Tuesday' },
    { sourceDate: '2025-06-19T07:18:29', expected: 25, weekday: 'Wednesday' },
    { sourceDate: '2025-06-20T07:18:29', expected: 25, weekday: 'Thursday' },
  ])(
    'should return the correct week number for "$sourceDate" with time part',
    ({ sourceDate, expected }) => {
      expect(esday(sourceDate).week()).toBe(expected)
      expectSame((esday) => esday(sourceDate).week())
    },
  )

  it.each([
    { sourceDate: '2023-01-01', expected: 52, weekday: 'Sunday' },
    { sourceDate: '2023-12-31', expected: 52, weekday: 'Sunday' },
    { sourceDate: '2024-01-01', expected: 1, weekday: 'Monday' },
    { sourceDate: '2024-12-29', expected: 52, weekday: 'Friday' },
    { sourceDate: '2024-12-30', expected: 1, weekday: 'Saturday' },
    { sourceDate: '2024-12-31', expected: 1, weekday: 'Tuesday' },
    { sourceDate: '2025-01-01', expected: 1, weekday: 'Wednesday' },
  ])('should handle year transition correctly for "$sourceDate"', ({ sourceDate, expected }) => {
    expect(esday(sourceDate).week()).toBe(expected)
    expectSame((esday) => esday(sourceDate).week())
  })

  it('should set the correct week number and adjust the date', () => {
    const date = esday('2024-06-15')
    const weekNumber = 10
    const adjustedDate = date.week(weekNumber)
    expect(adjustedDate.week()).toBe(weekNumber)
    expect(moment(adjustedDate.toISOString()).week()).toBe(weekNumber)
  })
})
