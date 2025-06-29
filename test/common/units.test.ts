import { describe, expect, it } from 'vitest'
import { normalizeUnitWithPlurals } from '~/common/units'
import type { UnitTypePlurals } from '~/common/units'

describe('normalizeUnitWithPlurals', () => {
  it.each([
    { unit: 'y', expected: 'year' },
    { unit: 'year', expected: 'year' },
    { unit: 'years', expected: 'year' },
    { unit: 'Q', expected: 'quarter' },
    { unit: 'quarter', expected: 'quarter' },
    { unit: 'quarters', expected: 'quarter' },
    { unit: 'M', expected: 'month' },
    { unit: 'month', expected: 'month' },
    { unit: 'months', expected: 'month' },
    { unit: 'w', expected: 'week' },
    { unit: 'week', expected: 'week' },
    { unit: 'weeks', expected: 'week' },
    { unit: 'W', expected: 'isoWeek' },
    { unit: 'isoWeek', expected: 'isoweek' },
    { unit: 'isoWeeks', expected: 'isoweek' },
    { unit: 'D', expected: 'date' },
    { unit: 'date', expected: 'date' },
    { unit: 'dates', expected: 'date' },
    { unit: 'd', expected: 'day' },
    { unit: 'day', expected: 'day' },
    { unit: 'days', expected: 'day' },
    { unit: 'h', expected: 'hour' },
    { unit: 'hour', expected: 'hour' },
    { unit: 'hours', expected: 'hour' },
    { unit: 'm', expected: 'minute' },
    { unit: 'minute', expected: 'minute' },
    { unit: 'minutes', expected: 'minute' },
    { unit: 's', expected: 'second' },
    { unit: 'second', expected: 'second' },
    { unit: 'seconds', expected: 'second' },
    { unit: 'ms', expected: 'millisecond' },
    { unit: 'millisecond', expected: 'millisecond' },
    { unit: 'milliseconds', expected: 'millisecond' },
    { unit: 'i-am-no-unit', expected: 'i-am-no-unit' },
    { unit: 123, expected: 123 },
  ])('should return the normalized form "$expected" for unit "$unit"', ({ unit, expected }) => {
    expect(normalizeUnitWithPlurals(unit as UnitTypePlurals)).toBe(expected)
  })
})
