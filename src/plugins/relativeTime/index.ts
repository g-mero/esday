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
import type { DateType, EsDay, EsDayPlugin, UnitTypeAddSub } from 'esday'
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

export type ThresholdRelativeTime = {
  ss: number
  s: number
  m: number
  h: number
  d: number
  w: number | null
  M: number
}

const relativeTimePlugin: EsDayPlugin<{
  thresholds?: ThresholdRelativeTime
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
    w: 'a week',
    ww: '%d weeks',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  }

  const defaultThresholds: ThresholdRelativeTime = {
    ss: 44,
    s: 45,
    m: 45,
    h: 22,
    d: 26,
    w: null,
    M: 11,
  }

  const thresholds: ThresholdRelativeTime = options.thresholds ?? defaultThresholds

  const rounding = options.rounding ?? Math.round
  const abs = Math.abs

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
    unit: UnitTypeAddSub,
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

    const diffsAsUnit = {
      s: differenceInUnits(this, referenceDate, 's', isFrom),
      m: differenceInUnits(this, referenceDate, 'm', isFrom),
      h: differenceInUnits(this, referenceDate, 'h', isFrom),
      d: differenceInUnits(this, referenceDate, 'd', isFrom),
      w: differenceInUnits(this, referenceDate, 'w', isFrom),
      M: differenceInUnits(this, referenceDate, 'M', isFrom),
      y: differenceInUnits(this, referenceDate, 'y', isFrom),
    }

    const locale = this.localeObject?.()
    const relativeTimeDef = locale?.relativeTime ?? defaultRelativeTimeDef
    const isFuture = diffsAsUnit.s > 0
    let out = ''
    let selectedKeyAndValue: { key: string; value: number | undefined }

    // test all thresholds until we find the first threshold matching the
    // difference between the instance and the reference date
    selectedKeyAndValue = { key: '', value: 0 }
    if (rounding(abs(diffsAsUnit.s)) <= thresholds.ss) {
      selectedKeyAndValue.key = 's'
      selectedKeyAndValue.value = rounding(abs(diffsAsUnit.s))
    } else if (rounding(abs(diffsAsUnit.s)) < thresholds.s) {
      selectedKeyAndValue.key = 'ss'
      selectedKeyAndValue.value = rounding(abs(diffsAsUnit.s))
    } else if (rounding(abs(diffsAsUnit.m)) <= 1) {
      selectedKeyAndValue.key = 'm'
      selectedKeyAndValue.value = undefined
    } else if (rounding(abs(diffsAsUnit.m)) < thresholds.m) {
      selectedKeyAndValue.key = 'mm'
      selectedKeyAndValue.value = rounding(abs(diffsAsUnit.m))
    } else if (rounding(abs(diffsAsUnit.h)) <= 1) {
      selectedKeyAndValue.key = 'h'
      selectedKeyAndValue.value = undefined
    } else if (rounding(abs(diffsAsUnit.h)) < thresholds.h) {
      selectedKeyAndValue.key = 'hh'
      selectedKeyAndValue.value = rounding(abs(diffsAsUnit.h))
    } else if (rounding(abs(diffsAsUnit.d)) <= 1) {
      selectedKeyAndValue.key = 'd'
      selectedKeyAndValue.value = undefined
    } else if (rounding(abs(diffsAsUnit.d)) < thresholds.d) {
      selectedKeyAndValue.key = 'dd'
      selectedKeyAndValue.value = rounding(abs(diffsAsUnit.d))
    } else if (thresholds.w !== null && rounding(abs(diffsAsUnit.w)) <= 1) {
      selectedKeyAndValue.key = 'w'
      selectedKeyAndValue.value = undefined
    } else if (thresholds.w !== null && rounding(abs(diffsAsUnit.w)) < thresholds.w) {
      selectedKeyAndValue.key = 'ww'
      selectedKeyAndValue.value = rounding(abs(diffsAsUnit.w))
    } else if (rounding(abs(diffsAsUnit.M)) <= 1) {
      selectedKeyAndValue.key = 'M'
      selectedKeyAndValue.value = undefined
    } else if (rounding(abs(diffsAsUnit.M)) < thresholds.M) {
      selectedKeyAndValue.key = 'MM'
      selectedKeyAndValue.value = rounding(abs(diffsAsUnit.M))
    } else if (rounding(abs(diffsAsUnit.y)) <= 1) {
      selectedKeyAndValue.key = 'y'
      selectedKeyAndValue.value = undefined
    } else {
      selectedKeyAndValue.key = 'yy'
      selectedKeyAndValue.value = rounding(abs(diffsAsUnit.y))
    }

    const format = relativeTimeDef[selectedKeyAndValue.key as RelativeTimeKeys]
    const outputDiffAbs = rounding(abs(selectedKeyAndValue.value ?? 1))
    out =
      typeof format === 'string'
        ? format.replace('%d', `${outputDiffAbs}`)
        : format(
            outputDiffAbs,
            withoutSuffix,
            selectedKeyAndValue.key as RelativeTimeKeys,
            isFuture,
          )

    // transform the result to locale form
    const postFormat = locale?.postFormat
    if (postFormat) {
      out = postFormat(out)
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
