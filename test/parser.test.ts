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

it('format', () => {
  const inst = esday('2021-01-01')
  expect(inst.format('YYYY-MM-DD')).toBe('2021-01-01')
  expect(inst.format('YYYY-MM-DD HH')).toBe('2021-01-01 00')
  expect(inst.format('YYYY-MM-DD HH:mm')).toBe('2021-01-01 00:00')
  expect(inst.format('YYYY-MM-DD HH:mm:ss')).toBe('2021-01-01 00:00:00')
  expect(inst.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2021-01-01 00:00:00.000')
  expect(inst.format('YYYY年MM月DD日 HH时mm分ss秒')).toBe('2021年01月01日 00时00分00秒')
})
