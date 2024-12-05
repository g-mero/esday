import { expect, it } from 'vitest'
import { esday } from '~/core'

it('start of', () => {
  expect(esday('2024-01-05 12:34:56').startOf('year').format('YYYY-MM-DD')).toBe('2024-01-01')
  expect(esday('2024-01-05 12:34:56').startOf('month').format('YYYY-MM-DD')).toBe('2024-01-01')
  expect(esday('2024-01-05 12:34:56').startOf('week').format('YYYY-MM-DD')).toBe('2023-12-31')
  expect(esday('2024-01-05 12:34:56').startOf('day').format('YYYY-MM-DD')).toBe('2024-01-05')
  expect(esday('2024-01-05 12:34:56').startOf('hour').format('YYYY-MM-DD HH:mm')).toBe('2024-01-05 12:00')
  expect(esday('2024-01-05 12:34:56').startOf('minute').format('YYYY-MM-DD HH:mm:ss')).toBe('2024-01-05 12:34:00')
  expect(esday('2024-01-05 12:34:56').startOf('second').format('YYYY-MM-DD HH:mm:ss')).toBe('2024-01-05 12:34:56')
})

it('end of', () => {
  expect(esday('2024-01-05 12:34:56').endOf('year').format('YYYY-MM-DD')).toBe('2024-12-31')
  expect(esday('2024-01-05 12:34:56').endOf('month').format('YYYY-MM-DD')).toBe('2024-01-31')
  expect(esday('2024-01-05 12:34:56').endOf('week').format('YYYY-MM-DD')).toBe('2024-01-06')
  expect(esday('2024-01-05 12:34:56').endOf('day').format('YYYY-MM-DD')).toBe('2024-01-05')
  expect(esday('2024-01-05 12:34:56').endOf('hour').format('YYYY-MM-DD HH:mm')).toBe('2024-01-05 12:59')
  expect(esday('2024-01-05 12:34:56').endOf('minute').format('YYYY-MM-DD HH:mm:ss')).toBe('2024-01-05 12:34:59')
  expect(esday('2024-01-05 12:34:56').endOf('second').format('YYYY-MM-DD HH:mm:ss')).toBe('2024-01-05 12:34:56')
})
