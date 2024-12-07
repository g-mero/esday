import { esday } from 'esday'
import { expect, it } from 'vitest'
import { customParseFormatPlugin } from '~/plugins/customParseFormat'
import { isTodayPlugin } from '~/plugins/isToday'

esday.extend(isTodayPlugin).extend(customParseFormatPlugin)

it('isToday', () => {
  expect(esday().isToday()).toBe(true)
  expect(esday('2021-01-01').isToday()).toBe(false)
})

it('customParseFormat', () => {
  const inst = esday('2024年07月月09日日.00时', { format: 'YYYY年MM月月DD日日.HH时' })
  expect(inst.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-07-09 00:00:00')

  const wrongInst = esday('2024-07-8', { format: 'YYYY-MM-DD' })
  expect(wrongInst.isValid()).toBe(false)
})
