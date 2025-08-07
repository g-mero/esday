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
import { C, createInstanceFromExist } from '~/common'
import type { Locale, RelativeTimeKeys } from '../locale'

declare module 'esday' {
  interface EsDay {
    to: (referenceDate: DateType, withoutSuffix?: boolean) => string
    from: (referenceDate: DateType, withoutSuffix?: boolean) => string
    toNow: (withoutSuffix?: boolean) => string
    fromNow: (withoutSuffix?: boolean) => string
  }
}

export type ThresholdUnit =
  | typeof C.SECOND
  | typeof C.MIN
  | typeof C.HOUR
  | typeof C.DAY
  | typeof C.MONTH
  | typeof C.YEAR

export type Threshold = {
  key: RelativeTimeKeys
  thresholdValue?: number // defaults to positive infinity
  thresholdUnit?: ThresholdUnit // defaults to 'second'
}

const relativeTimePlugin: EsDayPlugin<{
  thresholds?: Threshold[]
  rounding?: (valueToRound: number) => number
}> = (options, dayClass, dayFactory) => {
  const proto = dayClass.prototype

  // Use relativeTime definition from locales/en.ts as default
  const defaultRelativeTimeDef: Locale['relativeTime'] = {
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
    { key: 's', thresholdValue: 44, thresholdUnit: C.SECOND },
    { key: 'ss', thresholdValue: 43, thresholdUnit: C.SECOND },
    { key: 'm', thresholdValue: 89, thresholdUnit: C.SECOND },
    { key: 'mm', thresholdValue: 44, thresholdUnit: C.MIN },
    { key: 'h', thresholdValue: 89, thresholdUnit: C.MIN },
    { key: 'hh', thresholdValue: 21, thresholdUnit: C.HOUR },
    { key: 'd', thresholdValue: 35, thresholdUnit: C.HOUR },
    { key: 'dd', thresholdValue: 25, thresholdUnit: C.DAY },
    { key: 'M', thresholdValue: 45, thresholdUnit: C.DAY },
    { key: 'MM', thresholdValue: 10, thresholdUnit: C.MONTH },
    { key: 'y', thresholdValue: 17, thresholdUnit: C.MONTH },
    { key: 'yy', thresholdUnit: C.YEAR },
  ]

  const rounding = options.rounding ?? Math.round

  /**
   * Calculate the difference between instance and referenceDate in given units
   * as fractional value for 'from' and 'to'
   * @param instance - date to calculate difference for
   * @param referenceDate - base date for calculating the difference
   * @param unit - unit of the difference
   * @param isFrom - difference for 'from'?
   * @returns difference as float
   */
  function differenceInUnits(
    instance: EsDay,
    referenceDate: EsDay,
    unit: ThresholdUnit,
    isFrom: boolean,
  ): number {
    return isFrom
      ? referenceDate.diff(instance, unit, true)
      : instance.diff(referenceDate, unit, true)
  }

  /**
   * Format instance date as relative to reference date as
   * human readable length of time.
   * @param reference - date the output relates to
   * @param withoutSuffix - format without 'in ---' or '... ago'
   * @param this - date to format
   * @param isFrom - format as 'from' or 'fromNow'
   * @returns difference formatted as human string (e.g. 5 days ago)
   */
  function fromToBase(
    this: EsDay,
    reference: DateType,
    withoutSuffix: boolean,
    isFrom: boolean,
  ): string {
    const referenceDate = dayFactory(reference)
    if (!(this.isValid() && referenceDate.isValid())) {
      return C.INVALID_DATE_STRING
    }

    const locale = this.localeObject?.()
    const relativeTimeDef = locale?.relativeTime ?? defaultRelativeTimeDef
    let diffAsUnit = 0
    let out = ''
    let isFuture = false

    // test all thresholds until we find the first threshold matching the
    // difference between the instance and the reference date
    for (let i = 0; i < thresholds.length; i++) {
      const threshold = thresholds[i]
      const thresholdUnit = threshold.thresholdUnit ?? C.SECOND
      diffAsUnit = differenceInUnits(this, referenceDate, thresholdUnit, isFrom)
      const absoluteDiff = rounding(Math.abs(diffAsUnit))
      isFuture = diffAsUnit > 0

      if (absoluteDiff <= (threshold.thresholdValue ?? Number.POSITIVE_INFINITY)) {
        // calculate diff in unit defined by key
        const thresholdKey = threshold.key
        const formatUnit = thresholdKey.slice(0, 1) as ThresholdUnit
        const outputDiff = differenceInUnits(this, referenceDate, formatUnit, isFrom)
        const outputDiffAbs = rounding(Math.abs(outputDiff))
        const format = relativeTimeDef[thresholdKey]

        out =
          typeof format === 'string'
            ? format.replace('%d', `${outputDiffAbs}`)
            : format(outputDiffAbs, withoutSuffix, thresholdKey, isFuture)

        // transform the result to locale form
        const postFormat = locale?.postFormat
        if (postFormat) {
          out = postFormat(out)
        }

        break
      }
    }

    if (withoutSuffix) return out

    const suffix = isFuture ? relativeTimeDef.future : relativeTimeDef.past
    return typeof suffix === 'function'
      ? suffix(out, withoutSuffix, isFuture ? 'future' : 'past', isFuture)
      : suffix.replace('%s', out)
  }

  proto.to = function (this: EsDay, referenceDate: DateType, withoutSuffix?: boolean) {
    return fromToBase.call(this, referenceDate, withoutSuffix ?? false, true)
  }

  proto.from = function (this: EsDay, referenceDate: DateType, withoutSuffix?: boolean) {
    return fromToBase.call(this, referenceDate, withoutSuffix ?? false, false)
  }

  proto.toNow = function (this: EsDay, withoutSuffix?: boolean) {
    const now = createInstanceFromExist(new Date(), this)
    return this.to(now, withoutSuffix)
  }

  proto.fromNow = function (this: EsDay, withoutSuffix?: boolean) {
    const now = createInstanceFromExist(new Date(), this)
    return this.from(now, withoutSuffix)
  }
}

export default relativeTimePlugin
