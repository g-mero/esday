import { expect, it } from 'vitest'
import { esday } from '~/core'

it('isSame', () => {
  const inst = esday('2021-01-01')
  expect(inst.isSame('2021-01-01', 'day')).toBe(true)
  expect(inst.isSame('2021-01-01', 'hour')).toBe(true)
  expect(inst.isSame('2021-01-01', 'minute')).toBe(true)
  expect(inst.isSame('2021-01-01', 'second')).toBe(true)
  expect(inst.isSame('2021-01-01', 'millisecond')).toBe(true)
  // false
  expect(inst.isSame('2021-01-02', 'day')).toBe(false)
  expect(inst.isSame('2021-01-02', 'hour')).toBe(false)
  expect(inst.isSame('2021-01-02', 'minute')).toBe(false)
  expect(inst.isSame('2021-01-02', 'second')).toBe(false)
  expect(inst.isSame('2021-01-02', 'millisecond')).toBe(false)
})

it('isAfter', () => {
  expect(esday('2021-01-01').isAfter('2021-01-02', 'day')).toBe(false)
  expect(esday('2021-01-01').isAfter('2021-01-02', 'hour')).toBe(false)
  expect(esday('2021-01-01').isAfter('2021-01-02', 'minute')).toBe(false)
  expect(esday('2021-01-01').isAfter('2021-01-02', 'second')).toBe(false)
  expect(esday('2021-01-01').isAfter('2021-01-02', 'millisecond')).toBe(false)
})

it('isBefore', () => {
  expect(esday('2021-01-01').isBefore('2021-01-02', 'day')).toBe(true)
  expect(esday('2021-01-01').isBefore('2021-01-02', 'hour')).toBe(true)
  expect(esday('2021-01-01').isBefore('2021-01-02', 'minute')).toBe(true)
  expect(esday('2021-01-01').isBefore('2021-01-02', 'second')).toBe(true)
  expect(esday('2021-01-01').isBefore('2021-01-02', 'millisecond')).toBe(true)
})
