/* eslint-disable dot-notation */
import { esday } from 'esday'
import moment from 'moment'
import { describe, expect, it } from 'vitest'
import localeEnUs from '~/locales/en-us'
import { localePlugin, weekOfYearPlugin } from '~/plugins'

// set to 'en-US' to match moment's default locale
// ! note that change moment's default locale will break browser tests
esday.extend(localePlugin).extend(weekOfYearPlugin)
esday.registerLocale(localeEnUs)
esday.locale('en-US')

describe('week plugin', () => {
  it('should return the correct week number for a date', () => {
    expect(esday('2024-01-01').week()).toBe(moment('2024-01-01').week())
    expect(esday('2024-12-31').week()).toBe(moment('2024-12-31').week())
    expect(esday('2024-06-15').week()).toBe(moment('2024-06-15').week())
    expect(esday('2025-01-01').week()).toBe(moment('2025-01-01').week())
  })

  it('should handle year transition correctly', () => {
    expect(esday('2023-12-31').week()).toBe(moment('2023-12-31').week())
    expect(esday('2024-01-01').week()).toBe(moment('2024-01-01').week())
  })

  it('should handle custom start of the year', () => {
    // Assume the locale plugin is available and `yearStart` is set
    const customYearStart = 1 // 2nd day of the year
    const customDay = esday('2023-01-01') // Sunday
    // @ts-expect-error Mock `$locale` method to return custom `yearStart`
    customDay['$locale'] = () => ({ yearStart: customYearStart })
    expect(customDay.weeks()).toBe(1)
  })

  it('should set the correct week number and adjust the date', () => {
    const date = esday('2024-06-15')
    const weekNumber = 10
    const adjustedDate = date.week(weekNumber)
    expect(adjustedDate.week()).toBe(weekNumber)
    expect(moment(adjustedDate.toISOString()).week()).toBe(weekNumber)
  })

  it('should handle edge cases around the start and end of the year', () => {
    const startOfYear = esday('2024-01-01')
    expect(startOfYear.week()).toBe(moment('2024-01-01').week())

    const endOfYear = esday('2024-12-31')
    expect(endOfYear.week()).toBe(moment('2024-12-31').week())

    const yearTransition = esday('2024-12-30')
    expect(yearTransition.week()).toBe(moment('2024-12-30').week())
  })
})
