import type { EsDay, EsDayPlugin } from 'esday'
import { getDateTimeFormat } from './getDateTimeFormat'
import { C } from '~/common'

/**
 * Generate formatted date parts for a given timestamp and timezone.
 *
 * This function creates a Date object from the given timestamp,
 * retrieves a cached or new Intl.DateTimeFormat instance using
 * the provided timezone and options, and returns the formatted parts.
 *
 * @param timestamp - The timestamp in milliseconds since the Unix epoch.
 * @param timezone - The IANA timezone identifier (e.g., "Asia/Shanghai").
 * @param options - Optional settings for formatting, specifically timeZoneName.
 * @returns An array of formatted date parts.
 */
function makeFormatParts(
  timestamp: number,
  timezone: string,
  options: {
    timeZoneName?: 'short' | 'long'
  } = {},
): Intl.DateTimeFormatPart[] {
  // Create a Date object from the timestamp
  const date = new Date(timestamp)

  // Get the DateTimeFormat instance
  const dtf = getDateTimeFormat(timezone, options)

  // Format the date into parts
  return dtf.formatToParts(date)
}

const typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  hour: 3,
  minute: 4,
  second: 5,
} as Record<string, number>

const timezonePLugin: EsDayPlugin<{}> = (_, dayClass, esdayFactory) => {
  const defaultTimezone = ''

  const tzOffset = (timestamp: number, timezone: string) => {
    const formatResult = makeFormatParts(timestamp, timezone)
    const filled = []
    for (let i = 0; i < formatResult.length; i += 1) {
      const { type, value } = formatResult[i]
      const pos = typeToPos[type]

      if (pos >= 0) {
        filled[pos] = Number.parseInt(value, 10)
      }
    }
    const hour = filled[3]
    // Workaround for the same behavior in different node version
    // https://github.com/nodejs/node/issues/33027
    /* istanbul ignore next */
    const fixedHour = hour === 24 ? 0 : hour
    const utcString = `${filled[0]}-${filled[1]}-${filled[2]} ${fixedHour}:${filled[4]}:${filled[5]}:000`
    const utcTs = esdayFactory.utc(utcString).valueOf()
    let asTS = +timestamp
    const over = asTS % 1000
    asTS -= over
    return (utcTs - asTS) / (60 * 1000)
  }

  // find the right offset a given local time. The o input is our guess, which determines which
  // offset we'll pick in ambiguous cases (e.g. there are two 3 AMs b/c Fallback DST)
  // https://github.com/moment/luxon/blob/master/src/datetime.js#L76
  const fixOffset = (localTS: number, o0: number, tz: string) => {
    // Our UTC time is just a guess because our offset is just a guess
    let utcGuess = localTS - o0 * 60 * 1000
    // Test whether the zone matches the offset for this ts
    const o2 = tzOffset(utcGuess, tz)
    // If so, offset didn't change and we're done
    if (o0 === o2) {
      return [utcGuess, o0]
    }
    // If not, change the ts by the difference in the offset
    utcGuess -= (o2 - o0) * 60 * 1000
    // If that gives us the local time we want, we're done
    const o3 = tzOffset(utcGuess, tz)
    if (o2 === o3) {
      return [utcGuess, o2]
    }
    // If it's different, we're in a hole time.
    // The offset has changed, but the we don't adjust the time
    return [localTS - Math.min(o2, o3) * 60 * 1000, Math.max(o2, o3)]
  }

  dayClass.prototype.tz = function (timezone = defaultTimezone, keepLocalTime = false) {
    const oldOffset = this.utcOffset()
    const date = this.toDate()
    const target = date.toLocaleString('en-US', { timeZone: timezone })
    const diff = Math.round((date.valueOf() - new Date(target).valueOf()) / 1000 / 60)
    const offset = -Math.round(date.getTimezoneOffset() / 15) * 15 - diff
    const isUTC = !Number(offset)
    let ins: EsDay

    if (isUTC) {
      // if utcOffset is 0, turn it to UTC mode
      ins = this.utcOffset(0, keepLocalTime)
    } else {
      ins = esdayFactory(target)
        .locale(this.locale())
        ['$set'](C.MS, [this.millisecond()])
        .utcOffset(offset, true)
        .add(oldOffset, C.MIN)
      if (keepLocalTime) {
        const newOffset = ins.utcOffset()
        ins = ins.add(oldOffset - newOffset, C.MIN)
      }
    }
    ins['$conf'].timezone = timezone
    return ins
  }

  const oldStartOf = dayClass.prototype.startOf
  dayClass.prototype.startOf = function (units) {
    if (!this['$conf'] || !this['$conf']['$timezone']) {
      return oldStartOf.call(this, units)
    }

    const withoutTz = esdayFactory(this.format('YYYY-MM-DD HH:mm:ss:SSS')).locale(this.locale())
    const startOfWithoutTz = oldStartOf.call(withoutTz, units)
    return startOfWithoutTz.tz(this['$conf']['$timezone'] as string, true)
  }
  const oldEndOf = dayClass.prototype.endOf
  dayClass.prototype.endOf = function (units) {
    if (!this['$conf'] || !this['$conf']['$timezone']) {
      return oldEndOf.call(this, units)
    }

    const withoutTz = esdayFactory(this.format('YYYY-MM-DD HH:mm:ss:SSS')).locale(this.locale())
    const endOfWithoutTz = oldEndOf.call(withoutTz, units)
    return endOfWithoutTz.tz(this['$conf']['$timezone'] as string, true)
  }
}

export default timezonePLugin
