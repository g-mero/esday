import { esday } from 'esday'
import { expect, it } from 'vitest'
import customParseFormatPlugin from '~/plugins/customParseFormat'

esday.extend(customParseFormatPlugin)

it('customParseFormat', () => {
  const inst = esday('2024年07月月09日日.00时', 'YYYY年MM月月DD日日.HH时')
  expect(inst.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-07-09 00:00:00')

  const wrongInst = esday('2024-07-8', 'YYYY-MM-DD')
  expect(wrongInst.isValid()).toBe(false)
})
