import { esday } from 'esday'
import { expect, it } from 'vitest'

it('utc', () => {
  expect(esday.utc().format('YYYY-MM-DD HH:mm:ss')).toBe(new Date().toISOString().slice(0, 19).replace('T', ' '))
  console.log(esday.utc().format('YYYY-MM-DD HH:mm:ss'), esday().format('YYYY-MM-DD HH:mm:ss'))
})
