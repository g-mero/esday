import { describe, expect, it } from 'vitest'
import { EsDay, esday } from '~/core'

describe('clone', () => {
  it('returns new instance as clone of original', () => {
    const base = esday()
    const cloned = base.clone()

    expect(base).toBeInstanceOf(EsDay)
    expect(cloned).toBeInstanceOf(EsDay)
    expect(base).toBe(base)
    expect(base).not.toBe(cloned)
    expect(base.valueOf()).toBe(cloned.valueOf())
  })

  it('esday(esday()) works like clone', () => {
    const base = esday()
    const cloned = esday(base)

    expect(base).toBeInstanceOf(EsDay)
    expect(cloned).toBeInstanceOf(EsDay)
    expect(base).toBe(base)
    expect(base).not.toBe(cloned)
    expect(base.valueOf()).toBe(cloned.valueOf())
  })
})
