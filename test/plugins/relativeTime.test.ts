import { esday } from 'esday'
import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { expectSame } from '../util'

import { C } from '~/common'
import { utcPlugin, relativeTimePlugin } from '~/plugins'

esday.extend(utcPlugin).extend(relativeTimePlugin)

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

  it('basic usage', () => {
    expectSame((esday) => esday().fromNow())
    expectSame((esday) => esday().fromNow(true))
    expectSame((esday) => esday().toNow())
    expectSame((esday) => esday().toNow(true))
    expectSame((esday) => esday().from(targeTimeAsString))
    expectSame((esday) => esday().from(targeTimeAsString, true))
    expectSame((esday) => esday().to(targeTimeAsString))
    expectSame((esday) => esday().to(targeTimeAsString, true))
  })

  it('invalid input', () => {
    // moment.js will return 'Invalid date' for invalid input
    // esday will return 'Invalid Date' for invalid input (align to Date.toString())
    expectSame((esday) => esday(C.INVALID_DATE).fromNow().toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).toNow().toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).from(targeTimeAsString).toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).to(targeTimeAsString).toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).fromNow(true).toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).toNow(true).toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).from(targeTimeAsString, true).toLowerCase())
    expectSame((esday) => esday(C.INVALID_DATE).to(targeTimeAsString, true).toLowerCase())
  })

  it('utc', () => {
    expectSame((esday) => esday.utc().fromNow())
    expectSame((esday) => esday.utc().toNow())
    expectSame((esday) => esday.utc().from(targeTimeAsString))
    expectSame((esday) => esday.utc().to(targeTimeAsString))
    expectSame((esday) => esday.utc().fromNow(true))
    expectSame((esday) => esday.utc().toNow(true))
    expectSame((esday) => esday.utc().from(targeTimeAsString, true))
    expectSame((esday) => esday.utc().to(targeTimeAsString, true))
  })
})
