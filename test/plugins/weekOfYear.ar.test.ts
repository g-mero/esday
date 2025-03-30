import { esday } from 'esday'
import moment from 'moment'
import { expectSame } from 'test/util'
import { describe, expect, it } from 'vitest'
import localeAr from '~/locales/ar'
import { localePlugin, weekOfYearPlugin } from '~/plugins'

esday.extend(localePlugin).extend(weekOfYearPlugin)
esday.registerLocale(localeAr)
esday.locale('ar')
moment.locale('ar')

// TODO Transfer to other locale test files
// TODO adjust all locales to use date and not doy
// HACK startOf does not account for current timezone!
describe('week plugin - locale "ar"', () => {
  it.each([
    { sourceDate: '2024-03-29', expected: 13, weekday: 'Friday' },
    { sourceDate: '2024-03-30', expected: 14, weekday: 'Saturday' },
    { sourceDate: '2024-03-31', expected: 14, weekday: 'Sunday' },
    { sourceDate: '2024-04-01', expected: 14, weekday: 'Monday' },
    { sourceDate: '2025-04-02', expected: 14, weekday: 'Tuesday' },

    { sourceDate: '2024-04-05', expected: 14, weekday: 'Friday' },
    { sourceDate: '2024-04-06', expected: 15, weekday: 'Saturday' },
    { sourceDate: '2024-04-07', expected: 15, weekday: 'Sunday' },
    { sourceDate: '2024-04-08', expected: 15, weekday: 'Monday' },
    { sourceDate: '2025-04-09', expected: 15, weekday: 'Tuesday' },

    { sourceDate: '2024-06-10', expected: 24, weekday: 'Monday' },
    { sourceDate: '2024-06-11', expected: 24, weekday: 'Tuesday' },
    { sourceDate: '2024-06-12', expected: 24, weekday: 'Wednesday' },
    { sourceDate: '2024-06-13', expected: 24, weekday: 'Thursday' },
    { sourceDate: '2024-06-14', expected: 24, weekday: 'Friday' },
    { sourceDate: '2024-06-15', expected: 25, weekday: 'Saturday' },
    { sourceDate: '2024-06-16', expected: 25, weekday: 'Sunday' },
    { sourceDate: '2024-06-17', expected: 25, weekday: 'Monday' },
    { sourceDate: '2025-06-18', expected: 25, weekday: 'Tuesday' },
    { sourceDate: '2025-06-19', expected: 25, weekday: 'Wednesday' },
    { sourceDate: '2025-06-20', expected: 25, weekday: 'Thursday' },
  ])('should return the correct week number for "$sourceDate"', ({ sourceDate, expected }) => {
    expect(esday(sourceDate).week()).toBe(expected)
    expectSame((esday) => esday(sourceDate).week())
  })

  it.each([
    { sourceDate: '2023-01-01', expected: 1, weekday: 'Sunday' },
    { sourceDate: '2023-12-31', expected: 1, weekday: 'Sunday' },
    { sourceDate: '2024-01-01', expected: 1, weekday: 'Monday' },
    { sourceDate: '2024-12-29', expected: 1, weekday: 'Friday' },
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
