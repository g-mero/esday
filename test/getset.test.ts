import { expect, it } from 'vitest'
import { esday } from '~/core'

const testStr = '2024-02-05 12:34:56.789'

it('get', () => {
  expect(esday(testStr).year()).toBe(2024)
  expect(esday(testStr).month()).toBe(1)
  expect(esday(testStr).date()).toBe(5)
  expect(esday(testStr).hour()).toBe(12)
  expect(esday(testStr).minute()).toBe(34)
  expect(esday(testStr).second()).toBe(56)
  expect(esday(testStr).millisecond()).toBe(789)
})

it('set', () => {
  expect(esday(testStr).year(2025).year()).toBe(2025)
  expect(esday(testStr).month(2).month()).toBe(2)
  expect(esday(testStr).date(6).date()).toBe(6)
  expect(esday(testStr).hour(13).hour()).toBe(13)
  expect(esday(testStr).minute(35).minute()).toBe(35)
  expect(esday(testStr).second(57).second()).toBe(57)
  expect(esday(testStr).millisecond(790).millisecond()).toBe(790)
})
