import { esday } from 'esday'
import moment from 'moment-timezone'
import { describe, expect, it } from 'vitest'
import { localePlugin, utcPlugin } from '~/plugins'
import timezonePLugin from '~/plugins/timezone'

esday.extend(localePlugin).extend(utcPlugin).extend(timezonePLugin)

describe('timezone plugin', () => {
  it('should correctly handle edge cases', () => {
    const timestamp = '2014-06-01 12:00'
    const tz = 'America/New_York'

    expect(esday(timestamp).tz(tz).toISOString()).toEqual(moment(timestamp).tz(tz).toISOString())
    expect(esday(timestamp).tz(tz, true).format()).toEqual(moment(timestamp).tz(tz, true).format())
  })
})
