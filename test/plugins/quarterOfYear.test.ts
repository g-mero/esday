import { esday } from 'esday'
import moment from 'moment/min/moment-with-locales'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { UnitTypeAddSub } from '~/common/units'
import { quarterOfYearPlugin } from '~/plugins'
import { expectSame, expectSameResult } from '../util'

esday.extend(quarterOfYearPlugin)

describe('quarterOfYear plugin', () => {
  const fakeTimeAsString = '2023-12-17T03:24:46.234'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it.each([
    { sourceString: '2023-01-02T00:00:00.000', expected: 1 },
    { sourceString: '2023-01-01T23:59:59.999', expected: 1 },
    { sourceString: '2023-03-31T23:59:59.999', expected: 1 },
    { sourceString: '2023-04-01T00:00:00.000', expected: 2 },
    { sourceString: '2023-06-30T23:59:59.999', expected: 2 },
    { sourceString: '2023-07-01T00:00:00.000', expected: 3 },
    { sourceString: '2023-09-30T23:59:59.999', expected: 3 },
    { sourceString: '2023-10-01T00:00:00.000', expected: 4 },
  ])('get quarter of "$sourceString"', ({ sourceString, expected }) => {
    expect(esday(sourceString).quarter()).toBe(expected)
    expectSame((esday) => esday(sourceString).quarter())
  })

  it('get quarter of invalid date', () => {
    const sourceString = '2023-09-31T23:59:59.999'
    const esdayDate = esday(sourceString)
    const momentDate = moment(sourceString)

    expect(esdayDate.isValid()).toBeFalsy()
    expect(momentDate.isValid()).toBeFalsy()
    expect(esdayDate.quarter()).toBeNaN()
    expect(momentDate.quarter()).toBeNaN()
  })

  it.each([
    { sourceString: '2023-01-01T00:00:00.000', quarter: 2, expected: '2023-04-01T00:00:00.000' },
    { sourceString: '2023-02-05T04:05:06.789', quarter: 2, expected: '2023-04-01T00:00:00.000' },
    { sourceString: '2023-11-25T05:06:07.000', quarter: 3, expected: '2023-07-25T00:00:00.000' },
  ])('set quarter for "$sourceString" to "$quarter"', ({ sourceString, quarter }) => {
    expectSameResult((esday) => esday(sourceString).quarter(quarter))
  })

  it.each([
    { sourceString: '2023-01-05T09:10:21.456', value: 2, unit: 'quarter' },
    { sourceString: '2023-06-30T09:10:21.456', value: 2, unit: 'quarter' },
    { sourceString: '2023-06-30T09:10:21.456', value: 2, unit: 'quarters' },
    { sourceString: '2023-01-30T09:10:21.456', value: 1, unit: 'q' },
    { sourceString: '2023-01-30T09:10:21.456', value: 1, unit: 'quarter' },
    { sourceString: '2023-01-30T09:10:21.456', value: 1, unit: 'quarters' },
    { sourceString: '2023-01-31T09:10:21.456', value: 1, unit: 'quarter' },
  ])('add "$value" $unit to "$sourceString"', ({ sourceString, value, unit }) => {
    expectSameResult((esday) => esday(sourceString).add(value, unit as UnitTypeAddSub))
  })

  it.each([
    { sourceString: '2023-01-05T09:10:21.456', value: 2, unit: 'q' },
    { sourceString: '2023-01-05T09:10:21.456', value: 2, unit: 'quarter' },
    { sourceString: '2023-01-05T09:10:21.456', value: 2, unit: 'quarters' },
    { sourceString: '2023-08-30T09:10:21.456', value: 2, unit: 'quarter' },
    { sourceString: '2023-01-31T09:10:21.456', value: 1, unit: 'quarter' },
  ])('subtract "$value" quarter from "$sourceString"', ({ sourceString, value, unit }) => {
    expectSameResult((esday) => esday(sourceString).subtract(value, unit as UnitTypeAddSub))
  })

  it.each([
    { sourceString: '2023-01-05T09:10:21.456' },
    { sourceString: '2023-08-30T09:10:21.456' },
    { sourceString: '2023-12-31T09:10:21.456' },
    { sourceString: '2024-12-31T00:00:00' },
    { sourceString: '2025-01-01T00:00:00' },
  ])('startOf quarter of "$sourceString"', ({ sourceString }) => {
    expectSameResult((esday) => esday(sourceString).startOf('quarter'))
  })

  it.each([
    { sourceString: '2023-01-05T09:10:21.456' },
    { sourceString: '2023-08-30T09:10:21.456' },
    { sourceString: '2023-12-31T09:10:21.456' },
    { sourceString: '2024-12-31T00:00:00' },
    { sourceString: '2025-01-01T00:00:00' },
  ])('endOf quarter of "$sourceString"', ({ sourceString }) => {
    expectSameResult((esday) => esday(sourceString).startOf('quarter'))
  })

  it.each([
    { sourceString: '2023-01-05T09:10:21.456', formatString: 'YYYY Q' },
    { sourceString: '2023-08-30T09:10:21.456', formatString: 'YYYY Q' },
    { sourceString: '2023-01-31T09:10:21.456', formatString: 'YYYY Q' },
  ])('format "$sourceString" with "$formatString"', ({ sourceString, formatString }) => {
    expectSame((esday) => esday(sourceString).format(formatString))
  })
})
