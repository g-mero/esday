import { describe, expect, it } from 'vitest'
import type { UnitType } from '~/common/units'
import { esday } from '~/core'

describe('add', () => {
  it.each([
    { value: 1, unit: 'year', format: 'YYYY-MM-DD', expected: '2022-01-01' },
    { value: 1, unit: 'month', format: 'YYYY-MM-DD', expected: '2021-02-01' },
    { value: 1, unit: 'week', format: 'YYYY-MM-DD', expected: '2021-01-08' },
    { value: 1, unit: 'w', format: 'YYYY-MM-DD', expected: '2021-01-08' },
    { value: 1, unit: 'day', format: 'YYYY-MM-DD', expected: '2021-01-02' },
    { value: 1, unit: 'hour', format: 'YYYY-MM-DD HH', expected: '2021-01-01 01' },
    { value: 1, unit: 'minute', format: 'YYYY-MM-DD HH:mm', expected: '2021-01-01 00:01' },
    { value: 1, unit: 'second', format: 'YYYY-MM-DD HH:mm:ss', expected: '2021-01-01 00:00:01' },
    {
      value: 1,
      unit: 'millisecond',
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
      expected: '2021-01-01 00:00:00.001',
    },
  ])('add $value $unit to get $expected', ({ value, unit, format, expected }) => {
    const inst = esday('2021-01-01')

    expect(inst.add(value, unit as UnitType).format(format)).toBe(expected)
  })
})
