import { esday } from 'esday'
import moment from 'moment'
import { describe, expect, it } from 'vitest'
import minMaxPlugin from '~/plugins/minMax'

esday.extend(minMaxPlugin)

describe('minMax plugin', () => {
  it('should correctly determine the maximum date', () => {
    const testCases = [
      ['2025-01-01', '2024-12-31', '2023-06-15'],
      ['2023-01-01', '2023-12-31'],
      ['2024-02-29', '2024-02-28', '2024-01-01'], // Leap year edge case
    ]

    testCases.forEach((dateStrings) => {
      const maxEsDay = esday.max(...dateStrings)
      const maxMoment = moment.max(dateStrings.map(d => moment(d)))

      expect(maxEsDay?.toISOString()).toEqual(maxMoment.toISOString())
    })
  })

  it('should correctly determine the minimum date', () => {
    const testCases = [
      ['2025-01-01', '2024-12-31', '2023-06-15'],
      ['2023-01-01', '2023-12-31'],
      ['2024-02-29', '2024-02-28', '2024-01-01'], // Leap year edge case
    ]

    testCases.forEach((dateStrings) => {
      const minEsDay = esday.min(dateStrings)
      const minMoment = moment.min(dateStrings.map(d => moment(d)))

      expect(minEsDay.toISOString()).toEqual(minMoment.toISOString())
    })
  })

  it('should return current time for empty inputs', () => {
    expect(esday.max().format('YYYY-MM-DD')).toBe(moment.max().format('YYYY-MM-DD'))
    expect(esday.min().format('YYYY-MM-DD')).toBe(moment.min().format('YYYY-MM-DD'))
  })

  it('should handle invalid dates gracefully', () => {
    const testDates = [
      esday('2025-01-01'),
      esday('invalid-date'),
      esday('2024-12-31'),
    ]
    const momentDates = [
      moment('2025-01-01'),
      moment.invalid(),
      moment('2024-12-31'),
    ]

    const maxEsDay = esday.max(testDates)
    const maxMoment = moment.max(momentDates)

    expect(maxEsDay.isValid()).toBe(false)
    expect(maxEsDay.isValid()).toEqual(maxMoment.isValid())

    const minEsDay = esday.min(testDates)
    const minMoment = moment.min(momentDates)

    expect(maxEsDay.isValid()).toBe(false)
    expect(minEsDay.isValid()).toEqual(minMoment.isValid())
  })
})
