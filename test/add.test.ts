import { expect, it } from 'vitest'
import { esday } from '~/core'

it('add', () => {
  const inst = esday('2021-01-01')
  expect(inst.add(1, 'day').format('YYYY-MM-DD')).toBe('2021-01-02')
  expect(inst.add(1, 'hour').format('YYYY-MM-DD HH')).toBe('2021-01-01 01')
  expect(inst.add(1, 'minute').format('YYYY-MM-DD HH:mm')).toBe('2021-01-01 00:01')
  expect(inst.add(1, 'second').format('YYYY-MM-DD HH:mm:ss')).toBe('2021-01-01 00:00:01')
  expect(inst.add(1, 'millisecond').format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2021-01-01 00:00:00.001')
  expect(inst.add(1, 'month').format('YYYY-MM-DD')).toBe('2021-02-01')
  expect(inst.add(1, 'year').format('YYYY-MM-DD')).toBe('2022-01-01')
  expect(inst.add(1, 'week').format('YYYY-MM-DD')).toBe('2021-01-08')
  expect(inst.add(1, 'w').format('YYYY-MM-DD')).toBe('2021-01-08')
})
