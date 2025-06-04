/**
 * RelativeTime adds .from .to .fromNow .toNow APIs to formats date to relative time strings (e.g. 3 hours ago).
 *
 * Time from now .fromNow(withoutSuffix?: boolean)
 * Returns the string of relative time from now.
 *
 * Time from X .from(compared: Dayjs, withoutSuffix?: boolean)
 * Returns the string of relative time from X.
 *
 * Time to now .toNow(withoutSuffix?: boolean)
 * Returns the string of relative time to now.
 *
 * Time to X .to(compared: Dayjs, withoutSuffix?: boolean)
 * Returns the string of relative time to X.
 */
import type { DateType, EsDay, EsDayPlugin } from 'esday'
import { C } from '~/common'
import type { Locale, RelativeTimeKeys } from '../locale'

declare module 'esday' {
  interface EsDay {
    to: (referenceDate: DateType, withoutSuffix?: boolean) => string
    from: (referenceDate: DateType, withoutSuffix?: boolean) => string
    toNow: (withoutSuffix?: boolean) => string
    fromNow: (withoutSuffix?: boolean) => string
  }
}

type Threshold = {
  l: RelativeTimeKeys
  r?: number
  d?: typeof C.SECOND | typeof C.MIN | typeof C.HOUR | typeof C.DAY | typeof C.MONTH | typeof C.YEAR
}

const relativeTimePlugin: EsDayPlugin<{
  thresholds?: Threshold[]
  rounding?: (n: number) => number
}> = (options, Class, esday) => {
  const proto = Class.prototype

  // Default relative time strings
  // copy from locales/en.ts
  const defaultRTDef: Locale['relativeTime'] = {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    ss: '%d seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  }

  const thresholds: Threshold[] = options.thresholds ?? [
    { l: 's', r: 44, d: C.SECOND },
    { l: 'm', r: 89 },
    { l: 'mm', r: 44, d: C.MIN },
    { l: 'h', r: 89 },
    { l: 'hh', r: 21, d: C.HOUR },
    { l: 'd', r: 35 },
    { l: 'dd', r: 25, d: C.DAY },
    { l: 'M', r: 45 },
    { l: 'MM', r: 10, d: C.MONTH },
    { l: 'y', r: 17 },
    { l: 'yy', d: C.YEAR },
  ]

  const rounding = options.rounding ?? Math.round

  function fromToBase(
    referenceDate: DateType,
    withoutSuffix: boolean,
    instance: EsDay,
    isFrom: boolean,
    postFormat?: (formattedDate: string) => string,
  ): string {
    const inputInstance = esday(referenceDate)
    if (!instance.isValid() || !inputInstance.isValid()) {
      return C.INVALID_DATE_STRING
    }

    const locale = instance.localeObject?.()?.relativeTime ?? defaultRTDef
    let result = 0
    let out = ''
    let isFuture = false

    for (let i = 0; i < thresholds.length; i++) {
      let t = thresholds[i]
      if (t.d) {
        result = isFrom
          ? inputInstance.diff(instance, t.d, true)
          : instance.diff(inputInstance, t.d, true)
      }

      let abs = rounding(Math.abs(result))
      isFuture = result > 0

      if (abs <= (t.r ?? Number.POSITIVE_INFINITY)) {
        if (abs <= 1 && i > 0) t = thresholds[i - 1]
        const format = locale[t.l]
        if (postFormat) abs = Number.parseInt(postFormat(`${abs}`), 10)

        out =
          typeof format === 'string'
            ? format.replace('%d', abs.toString())
            : format(abs, withoutSuffix, t.l, isFuture)

        break
      }
    }

    if (withoutSuffix) return out

    const suffix = isFuture ? locale.future : locale.past
    return typeof suffix === 'function'
      ? suffix(out, withoutSuffix, isFuture ? 'future' : 'past', isFuture)
      : suffix.replace('%s', out)
  }

  const getNow = (self: EsDay) => (self['$conf'].utc ? esday.utc() : esday())

  proto.to = function (this: EsDay, referenceDate: DateType, withoutSuffix?: boolean) {
    return fromToBase(referenceDate, withoutSuffix ?? false, this, true)
  }

  proto.from = function (this: EsDay, referenceDate: DateType, withoutSuffix?: boolean) {
    return fromToBase(referenceDate, withoutSuffix ?? false, this, false)
  }

  proto.toNow = function (this: EsDay, withoutSuffix?: boolean) {
    return this.to(getNow(this), withoutSuffix)
  }

  proto.fromNow = function (this: EsDay, withoutSuffix?: boolean) {
    return this.from(getNow(this), withoutSuffix)
  }
}

export default relativeTimePlugin
