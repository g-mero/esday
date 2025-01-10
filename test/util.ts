import type { EsDay, EsDayFactory } from 'esday'
import type { Moment } from 'moment'
import { esday } from 'esday'
import moment from 'moment'
import { expect } from 'vitest'

/**
 * Call a given function with esday and moment and
 * check, if the resulting values are the same.
 * To be used in a vitest test file.
 * Example:
 * expectSame((esday) => esday().format())
 * @param fn function whose return value is to be checked
 */
export function expectSame(fn: (instance: EsDayFactory) => any) {
  const d = fn(esday)
  // call fn with moment; type casting avoids error from tsc
  const m = fn(moment as unknown as EsDayFactory)
  expect(d).toBe(m)
}

/**
 * Call a given function with esday and moment and
 * check, if the resulting objects are the same.
 * To be used in a vitest test file.
 * Example:
 * expectSameResult((esday) => esday().utc().utcOffset(100, true))
 * @param fn function whose return value is to be checked
 */
export function expectSameResult(fn: (instance: EsDayFactory) => EsDay | Moment) {
  const d = fn(esday)
  // call fn with moment; type casting avoids error from tsc
  const m = fn(moment as unknown as EsDayFactory)
  expect(d.isValid()).toBe(m.isValid())
  if (d.isValid()) {
    expect(d.toISOString()).toBe(m.toISOString())
    expect(d.valueOf()).toBe(m.valueOf())
    expect(d.millisecond()).toBe(m.millisecond())
    expect(d.toDate()).toEqual(m.toDate())
    expect(d.toJSON()).toBe(m.toJSON())
    expect(d.format()).toBe(m.format()) // not recommend
  }
  else {
    expect(d.toString().toLowerCase()).toBe(m.toString().toLowerCase())
  }
}
