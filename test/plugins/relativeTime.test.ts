import { esday } from 'esday'
import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { expectSame } from '../util'

import relativeTimePlugin from '~/plugins/relativeTime'
import { C } from '~/common'

esday.extend(relativeTimePlugin)

describe('relativeTime plugin', () => {
  const fakeTimeAsString = '2023-12-17T03:24:46.234'
  const targeTimeAsString = '2024-08-14T12:00:00.000Z'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fromNow', () => {
    expectSame((esday) => esday().fromNow())
    expectSame((esday) => esday().fromNow(true))
  })

  it('toNow', () => {
    expectSame((esday) => esday().toNow())
    expectSame((esday) => esday().toNow(true))
  })

  it('from', () => {
    expectSame((esday) => esday().from(targeTimeAsString))
    expectSame((esday) => esday().from(targeTimeAsString, true))
  })

  it('to', () => {
    expectSame((esday) => esday().to(targeTimeAsString))
    expectSame((esday) => esday().to(targeTimeAsString, true))
  })

  it('invalid input', () => {
    expectSame((esday) => esday(C.INVALID_DATE).fromNow().toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).toNow().toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).from(targeTimeAsString).toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).to(targeTimeAsString).toLowerCase())
  })
})
