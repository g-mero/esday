import { esday } from 'esday'
import moment from 'moment/min/moment-with-locales'
import { describe, expect, it } from 'vitest'
import relativeTimePlugin from '~/plugins/relativeTime'

esday.extend(relativeTimePlugin)

describe('relativeTime plugin', () => {
  it.each([
    { input: esday().subtract(30, 'second') },
    { input: esday().subtract(1, 'minute') },
    { input: esday().subtract(5, 'minute') },
    { input: esday().subtract(1, 'hour') },
    { input: esday().subtract(3, 'hour') },
    { input: esday().subtract(1, 'day') },
    { input: esday().subtract(10, 'day') },
    { input: esday().add(30, 'second') },
    { input: esday().add(1, 'minute') },
    { input: esday().add(5, 'day') },
    { input: esday().add(1, 'year') },
  ])('fromNow() output should match moment.fromNow()', ({ input }) => {
    const esResult = input.fromNow()
    const momentResult = moment(input.toDate()).fromNow()

    expect(esResult).toBe(momentResult)
  })

  it('toNow() should match moment.toNow()', () => {
    const input = esday().add(3, 'hour')
    const esResult = esday().to(input)
    const momentResult = moment().to(moment(input.toDate()))

    expect(esResult).toBe(momentResult)
  })

  it('from() and to() should match moment results', () => {
    const now = esday()
    const past = now.subtract(2, 'day')
    const future = now.add(3, 'day')

    expect(now.from(past)).toBe(moment(now.toDate()).from(moment(past.toDate())))
    expect(now.to(future)).toBe(moment(now.toDate()).to(moment(future.toDate())))
  })

  it('should match moment when using withoutSuffix = true', () => {
    const now = esday()
    const future = now.add(1, 'hour')

    const esResult = now.to(future, true)
    const momentResult = moment(now.toDate()).to(moment(future.toDate()), true)

    expect(esResult).toBe(momentResult)
  })

  it('should match moment with invalid inputs', () => {
    const invalidEs = esday('invalid')
    const validEs = esday()
    const invalidMoment = moment.invalid()
    const validMoment = moment()

    expect(invalidEs.from(validEs).toLowerCase()).toBe(
      invalidMoment.from(validMoment).toLowerCase(),
    )
    expect(invalidEs.to(validEs).toLowerCase()).toBe(invalidMoment.to(validMoment).toLowerCase())
    expect(validEs.from(invalidEs).toLowerCase()).toBe(
      validMoment.from(invalidMoment).toLowerCase(),
    )
    expect(validEs.to(invalidEs).toLowerCase()).toBe(validMoment.to(invalidMoment).toLowerCase())
  })
})
