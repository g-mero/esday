import { esday } from 'esday'
import type { UnitsObjectTypeSet } from 'esday'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import utcPlugin from '~/plugins/utc'

esday.extend(utcPlugin)

describe('plugin utc - without other plugins', () => {
  const fakeTimeAsString = '2023-12-17T03:24:46.234'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('get quarter', () => {
    expect(esday().utc().get('quarter')).toBeNaN()
  })

  it('get week', () => {
    expect(esday().utc().get('week')).toBeNaN()
  })

  it('set using an object without plugin ObjectSupport', () => {
    const value = { years: 1, months: 2, days: 3 } as UnitsObjectTypeSet
    const expected = '2023-12-17'

    expect(esday().utc().set(value).format().slice(0, 10)).toBe(expected)
  })
})
