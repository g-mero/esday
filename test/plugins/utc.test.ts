import { esday } from 'esday'
import moment from 'moment'
import { describe, expect, it } from 'vitest'
import utcPlugin from '~/plugins/utc'

esday.extend(utcPlugin)

describe('utc plugin', () => {
  it('should correctly initialize with utc()', () => {
    const esdayDate = esday.utc('2024-01-06T00:00:00Z')
    const momentDate = moment.utc('2024-01-06T00:00:00Z')
    expect(esdayDate.isUTC()).toBe(true)
    expect(esdayDate.format()).toBe(momentDate.format())
  })

  it('should correctly switch to UTC mode', () => {
    const esdayDate = esday('2024-01-06T08:00:00').utc()
    const momentDate = moment('2024-01-06T08:00:00').utc()
    expect(esdayDate.isUTC()).toBe(true)
    expect(esdayDate.format()).toBe(momentDate.format())
  })

  it('should correctly switch to local mode', () => {
    const esdayDate = esday.utc('2024-01-06T00:00:00Z').local()
    const momentDate = moment.utc('2024-01-06T00:00:00Z').local()
    expect(esdayDate.isUTC()).toBe(false)
    expect(esdayDate.format()).toBe(momentDate.format())
  })

  it('should handle UTC offset correctly', () => {
    const esdayDate = esday.utc('2024-01-06T00:00:00Z').utcOffset('+02:00')
    const momentDate = moment.utc('2024-01-06T00:00:00Z').utcOffset('+02:00')
    expect(esdayDate.format()).toBe(momentDate.format())

    const esdayOffset = esdayDate.utcOffset()
    const momentOffset = momentDate.utcOffset()
    expect(esdayOffset).toBe(momentOffset)
  })

  it('should correctly handle UTC offsets with keepLocalTime', () => {
    const esdayDate = esday('2024-01-06T00:00:00Z').utcOffset('+02:00', true)
    const momentDate = moment('2024-01-06T00:00:00Z').utcOffset('+02:00', true)

    expect(esdayDate.format()).toBe(momentDate.format())
  })

  it('should correctly handle invalid UTC offsets', () => {
    const esdayDate = esday.utc('2024-01-06T00:00:00Z').utcOffset('invalid')
    const momentDate = moment.utc('2024-01-06T00:00:00Z').utcOffset('invalid')
    expect(esdayDate.format()).toBe(momentDate.format())
  })

  it('should correctly parse and format in UTC mode', () => {
    const esdayDate = esday.utc('2024-01-06T12:00:00Z')
    const momentDate = moment.utc('2024-01-06T12:00:00Z')
    expect(esdayDate.format('YYYY-MM-DD HH:mm:ss')).toBe(
      momentDate.format('YYYY-MM-DD HH:mm:ss'),
    )
  })

  it('should correctly add and subtract in UTC mode', () => {
    const esdayDate = esday.utc('2024-01-06T00:00:00Z').add(1, 'day')
    const momentDate = moment.utc('2024-01-06T00:00:00Z').add(1, 'day')
    expect(esdayDate.format()).toBe(momentDate.format())

    const esdaySubtracted = esday.utc('2024-01-06T00:00:00Z').subtract(1, 'day')
    const momentSubtracted = moment
      .utc('2024-01-06T00:00:00Z')
      .subtract(1, 'day')
    expect(esdaySubtracted.format()).toBe(momentSubtracted.format())
  })
})
