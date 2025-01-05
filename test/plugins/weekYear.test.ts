import { esday } from 'esday'
import moment from 'moment'
import { describe, expect, it } from 'vitest'
import localeEnUs from '~/locales/en-us'
import { localePlugin, weekOfYearPlugin, weekYearPlugin } from '~/plugins'

// Extend esday with required plugins and locale
esday.extend(localePlugin).extend(weekOfYearPlugin).extend(weekYearPlugin)
esday.registerLocale(localeEnUs, 'en-us')
esday.locale('en-us')

describe('weekYear plugin', () => {
  it('should return the correct week year for a date', () => {
    expect(esday('2024-01-01').weekYear()).toBe(moment('2024-01-01').weekYear())
    expect(esday('2024-12-31').weekYear()).toBe(moment('2024-12-31').weekYear())
    expect(esday('2023-12-31').weekYear()).toBe(moment('2023-12-31').weekYear())
    expect(esday('2025-01-01').weekYear()).toBe(moment('2025-01-01').weekYear())
  })

  it('should handle year transition correctly', () => {
    expect(esday('2023-12-31').weekYear()).toBe(moment('2023-12-31').weekYear())
    expect(esday('2024-01-01').weekYear()).toBe(moment('2024-01-01').weekYear())
    expect(esday('2024-12-31').weekYear()).toBe(moment('2024-12-31').weekYear())
    expect(esday('2025-01-01').weekYear()).toBe(moment('2025-01-01').weekYear())
  })

  it('should handle edge cases around the start and end of the year', () => {
    const endOfYear = esday('2024-12-31')
    expect(endOfYear.weekYear()).toBe(moment('2024-12-31').weekYear())

    const startOfYear = esday('2024-01-01')
    expect(startOfYear.weekYear()).toBe(moment('2024-01-01').weekYear())

    const yearTransition = esday('2024-12-30')
    expect(yearTransition.weekYear()).toBe(moment('2024-12-30').weekYear())
  })
})
