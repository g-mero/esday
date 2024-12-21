import { expect, it } from 'vitest'
import { esday } from '~/core'

it('format', () => {
  const inst = esday('2021-01-01')
  expect(inst.format('YYYY-MM-DD')).toBe('2021-01-01')
  expect(inst.format('YYYY-MM-DD HH')).toBe('2021-01-01 00')
  expect(inst.format('YYYY-MM-DD HH:mm')).toBe('2021-01-01 00:00')
  expect(inst.format('YYYY-MM-DD HH:mm:ss')).toBe('2021-01-01 00:00:00')
  expect(inst.format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2021-01-01 00:00:00.000')
  // format: 'YYYY year MM month DD day HH hour mm minute ss second' in simplified chinese
  // result: 'January 01, 2021 00 hour 00 minute 00 second' in simplified chinese
  expect(inst.format('YYYY年MM月DD日 HH时mm分ss秒')).toBe('2021年01月01日 00时00分00秒')
})
