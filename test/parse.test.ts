import { expect, it } from 'vitest'
import { esday } from '~/core'

it('parse number', () => {
  expect(esday(0).valueOf()).toBe(0)
  expect(esday(1).valueOf()).toBe(1)
})

it('parse string', () => {
  expect(esday('2021-01-01').format('YYYY-MM-DD')).toBe('2021-01-01')
  expect(esday('2021-01-01T00:00:00').valueOf()).toBe(new Date('2021-01-01T00:00:00').getTime())
})
