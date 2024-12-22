import { esday } from 'esday'
import { describe, expect, it } from 'vitest'

describe('startOf', () => {
  const inst = esday('2024-01-05 12:34:56')
  it('on unit year', () => {
    expect(inst.startOf('year').format('YYYY-MM-DD')).toBe('2024-01-01')
  })

  it('on unit month', () => {
    expect(inst.startOf('month').format('YYYY-MM-DD')).toBe('2024-01-01')
  })

  it('on unit week', () => {
    expect(inst.startOf('week').format('YYYY-MM-DD')).toBe('2024-01-01')
  })

  it('on unit day', () => {
    expect(inst.startOf('day').format('YYYY-MM-DD')).toBe('2024-01-05')
  })

  it('on unit hour', () => {
    expect(inst.startOf('hour').format('YYYY-MM-DD HH:mm')).toBe('2024-01-05 12:00')
  })
})

describe('endOf', () => {
  const inst = esday('2024-01-05 12:34:56')
  it('on unit year', () => {
    expect(inst.endOf('year').format('YYYY-MM-DD')).toBe('2024-12-31')
  })

  it('on unit month', () => {
    expect(inst.endOf('month').format('YYYY-MM-DD')).toBe('2024-01-31')
  })

  it('on unit week', () => {
    expect(inst.endOf('week').format('YYYY-MM-DD')).toBe('2024-01-07')
  })

  it('on unit day', () => {
    expect(inst.endOf('day').format('YYYY-MM-DD')).toBe('2024-01-05')
  })

  it('on unit hour', () => {
    expect(inst.endOf('hour').format('YYYY-MM-DD HH:mm')).toBe('2024-01-05 12:59')
  })
})
