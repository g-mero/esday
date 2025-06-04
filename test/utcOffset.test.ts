import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { esday } from '~/core'
import { expectSame } from './util'

describe('utcOffset get', () => {
  const fakeTimeAsString = '2023-12-17T03:24:46.234'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return a number', () => {
    const offsetValue = esday().utcOffset()

    expect(offsetValue).toBeTypeOf('number')
  })

  it('should return the right value for the current date', () => {
    expectSame((esday) => esday().utcOffset())
  })
})
