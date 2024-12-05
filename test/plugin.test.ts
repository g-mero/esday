import { esday } from 'esday'
import { expect, it } from 'vitest'
import { isTodayPlugin } from '~/plugins/isToday'

esday.extend(isTodayPlugin)

it('isToday', () => {
  expect(esday().isToday()).toBe(true)
})
