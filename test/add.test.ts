import { describe, expect, it } from 'vitest'
import { C } from '~/common'
import type { UnitTypeAdd } from '~/common/units'
import { esday } from '~/core'
import { expectSameResult } from './util'

describe('add', () => {
  it.each([
    { value: 1, unit: 'y', format: 'YYYY-MM-DD', expected: '2022-01-01' },
    { value: 1, unit: 'year', format: 'YYYY-MM-DD', expected: '2022-01-01' },
    { value: 2, unit: 'years', format: 'YYYY-MM-DD', expected: '2023-01-01' },
    { value: 1, unit: 'M', format: 'YYYY-MM-DD', expected: '2021-02-01' },
    { value: 1, unit: 'month', format: 'YYYY-MM-DD', expected: '2021-02-01' },
    { value: 3, unit: 'months', format: 'YYYY-MM-DD', expected: '2021-04-01' },
    { value: 1, unit: 'w', format: 'YYYY-MM-DD', expected: '2021-01-08' },
    { value: 1, unit: 'week', format: 'YYYY-MM-DD', expected: '2021-01-08' },
    { value: 2, unit: 'weeks', format: 'YYYY-MM-DD', expected: '2021-01-15' },
    { value: 1, unit: 'd', format: 'YYYY-MM-DD', expected: '2021-01-02' },
    { value: 1, unit: 'day', format: 'YYYY-MM-DD', expected: '2021-01-02' },
    { value: 10, unit: 'days', format: 'YYYY-MM-DD', expected: '2021-01-11' },
    { value: 1, unit: 'h', format: 'YYYY-MM-DD HH', expected: '2021-01-01 01' },
    { value: 1, unit: 'hour', format: 'YYYY-MM-DD HH', expected: '2021-01-01 01' },
    { value: 4, unit: 'hours', format: 'YYYY-MM-DD HH', expected: '2021-01-01 04' },
    { value: 1, unit: 'm', format: 'YYYY-MM-DD HH:mm', expected: '2021-01-01 00:01' },
    { value: 1, unit: 'minute', format: 'YYYY-MM-DD HH:mm', expected: '2021-01-01 00:01' },
    { value: 6, unit: 'minutes', format: 'YYYY-MM-DD HH:mm', expected: '2021-01-01 00:06' },
    { value: 1, unit: 's', format: 'YYYY-MM-DD HH:mm:ss', expected: '2021-01-01 00:00:01' },
    { value: 1, unit: 'second', format: 'YYYY-MM-DD HH:mm:ss', expected: '2021-01-01 00:00:01' },
    { value: 15, unit: 'seconds', format: 'YYYY-MM-DD HH:mm:ss', expected: '2021-01-01 00:00:15' },
    {
      value: 1,
      unit: 'ms',
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
      expected: '2021-01-01 00:00:00.001',
    },
    {
      value: 1,
      unit: 'millisecond',
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
      expected: '2021-01-01 00:00:00.001',
    },
    {
      value: 123,
      unit: 'milliseconds',
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
      expected: '2021-01-01 00:00:00.123',
    },
  ])('basic - add $value $unit to get $expected', ({ value, unit, format, expected }) => {
    const inst = esday('2021-01-01')

    expect(inst.add(value, unit as UnitTypeAdd).format(format)).toBe(expected)
  })

  it.each([
    {
      sourceString: '2024-01-31T13:24:35.789',
      addedValue: 1,
      addUnit: C.DAY,
      expected: '2024-02-01T13:24:35',
    },
    {
      sourceString: '2023-01-28T13:24:35.789',
      addedValue: 1,
      addUnit: C.MONTH,
      expected: '2023-02-28T13:24:35',
    },
    {
      sourceString: '2024-01-31T13:24:35.789',
      addedValue: 1,
      addUnit: C.MONTH,
      expected: '2024-02-29T13:24:35',
    },
    {
      sourceString: '2023-12-31T13:24:35.789',
      addedValue: 1,
      addUnit: C.YEAR,
      expected: '2024-12-31T13:24:35',
    },
  ])(
    'edge case - add $value $unit to get $expected',
    ({ sourceString, addedValue, addUnit, expected }) => {
      expectSameResult((esday) => esday(sourceString).add(addedValue, addUnit))
      expect(esday(sourceString).add(addedValue, addUnit).format().slice(0, -6)).toBe(expected)
    },
  )
})
