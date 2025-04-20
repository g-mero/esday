import { esday } from 'esday'
import moment from 'moment-timezone'
import { describe, expect, it } from 'vitest'
import { localePlugin, utcPlugin } from '~/plugins'
import timezonePLugin from '~/plugins/timezone'

esday.extend(localePlugin).extend(utcPlugin).extend(timezonePLugin)

describe('timezone plugin', () => {
  it('1', () => {
    const timestamp = '2014-06-01 12:00'
    const tz = 'America/New_York'

    expect(esday(timestamp).tz(tz).toISOString()).toEqual(moment(timestamp).tz(tz).toISOString())
    expect(esday(timestamp).tz(tz, true).format()).toEqual(moment(timestamp).tz(tz, true).format())
  })

  it('utc', () => {
    const timestamp = '2014-06-01 12:00'
    const tz = 'America/New_York'

    expect(esday.utc(timestamp).tz(tz).toISOString()).toEqual(
      moment.utc(timestamp).tz(tz).toISOString(),
    )
    expect(esday.utc(timestamp).tz(tz, true).format()).toEqual(
      moment.utc(timestamp).tz(tz, true).format(),
    )
  })

  it('factory', () => {
    const timestamp = '2014-06-01 12:00'
    const tz = 'America/New_York'

    expect(esday.tz(timestamp, tz).toISOString()).toEqual(moment.tz(timestamp, tz).toISOString())
    expect(esday.tz(timestamp, tz).format()).toEqual(moment.tz(timestamp, tz).format())
  })
})
