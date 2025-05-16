/**
 * week plugin
 *
 * This plugin adds 'week', 'weeks', 'weekday', 'weekYear', 'weeksInYear'
 * and formatting and parsing tokens to EsDay
 *
 * This plugin requires the 'locale' plugin and a locale to be loaded.
 * For the 'wo' formatting token, the 'localizedFormat' plugin is required too.
 *
 * esday parameters in '$conf' defined in week plugin:
 *   parseOptions  ParseOptions object containing parsing options
 *
 * new esday parameters in '$conf.parseOptions':
 *   locale        name of the locale to use when parsing
 *   isUtc         evaluate date as utc
 */

import { esday } from 'esday'
import type { DateType, EsDay, EsDayPlugin, FormattingTokenDefinitions, UnitType } from 'esday'
import { C, isUndefined, padStart } from '~/common'
import type { ParseOptions, ParsedElements, TokenDefinitions } from '../advancedParse/types'
import { getLocale } from '../locale'

const DEFAULT_LOCALE = 'en'

const match1to2NoLeadingZero = /^[1-9]\d?/ // 1-99
const match1 = /\d/ // 0 - 9
const match2 = /\d\d/ // 00 - 99
const match1to2 = /\d\d?/ // 0 - 99
const match4 = /\d{4}/ // 0000 - 9999
const match1to4 = /\d{1,4}/ // 0 - 9999

declare module 'esday' {
  interface EsDay {
    week(): number
    week(newWeek: number): EsDay
    weeks(): number
    weeks(newWeek: number): EsDay
    weekday(): number
    weekday(newWeekday: number): EsDay
    weekYear(): number
    weekYear(newWeekYear: number): EsDay
    weeksInYear(): number
  }
}

/**
 * Convert a number to an ordinal number, if a locale is available.
 * Otherwise return value as string.
 * @param sourceDate - date to take the locale from
 * @param value - value to convert
 * @returns value as ordinal
 */
function toOrdinal(sourceDate: EsDay, value: number) {
  const defaultValue = value.toString()
  return sourceDate.localeObject?.().ordinal(value) ?? defaultValue
}

/**
 * Create a function that will parse the input string as week, weekday or
 * weekYear number and add it to the given 'parsedElements' containing the
 * date&time components.
 * @param property - name of the property to set
 * @returns function that will add the given value to date&time component as new element
 */
function addWeekProperty(property: 'week' | 'weekday' | 'weekYear') {
  return function weekPropUpdater(
    parsedElements: ParsedElements,
    input: string,
    _parseOptions: ParseOptions,
  ) {
    parsedElements[property] = +input
  }
}

// Helper functions
function parseTwoDigitYear(input: string): number {
  // 2-digitYears : use year+2000
  const inputLimited = input.slice(0, 2)
  const year = +inputLimited
  return year + (year > 68 ? 1900 : 2000)
}

/**
 * Add parsed year as 2-digit value to parsedElements
 * @param parsedElements - object containing the components of a parsed date
 * @param input - parsed value (year)
 * @param _options - parsing options e.g. containing the locale to use
 */
function twoDigitsYearUpdater(
  parsedElements: ParsedElements,
  input: string,
  _parseOptions: ParseOptions,
) {
  parsedElements['weekYear'] = parseTwoDigitYear(input)
}

/**
 * Create new esday from parsed Date object.
 * @param parsedDate - Date object returned by parsing function
 * @param parseOptions  - parsing options e.g. containing the locale to use
 * @returns Esday object matching the parsedDate
 */
function parsedDateToEsday(parsedDate: Date, parseOptions: ParseOptions) {
  let newEsday: EsDay
  if (!parseOptions.isUtc) {
    newEsday = esday(parsedDate)
  } else {
    newEsday = esday.utc(parsedDate)
  }

  // add locale name if exists
  const localeName = parseOptions['locale']
  if (!isUndefined(localeName)) {
    newEsday['$conf']['$locale_name'] = localeName
  }
  return newEsday
}

/**
 * Set the week of the parsed date.
 * @param parsedDate - Date object returned by parsing function
 * @param parsedElements - object containing the components of a parsed date
 * @param parseOptions - parsing options e.g. containing the locale to use
 * @returns parsedDate with week set to parsed value
 */
function postParseWeek(
  parsedDate: Date,
  parsedElements: ParsedElements,
  parseOptions: ParseOptions,
) {
  let modifiedDate = parsedDate

  // is this a valid date and do we have parsed the week?
  // if the source string contains a valid day of month, the week
  // is ignored (like moment.js does).
  if (
    !Number.isNaN(parsedDate.valueOf()) &&
    !isUndefined(parsedElements.week) &&
    isUndefined(parsedElements.day)
  ) {
    const newEsday: EsDay = parsedDateToEsday(parsedDate, parseOptions)
    const parsedWeek = parsedElements.week as number
    const modifiedEsday = newEsday.week(parsedWeek).weekday(0)
    modifiedDate = modifiedEsday.toDate()
  }
  return modifiedDate
}

/**
 * Set the dayOfWeek of the parsed date.
 * @param parsedDate - Date object returned by parsing function
 * @param parsedElements - object containing the components of a parsed date
 * @param parseOptions - parsing options e.g. containing the locale to use
 * @returns parsedDate or invalid date (if day of week does not match)
 */
function postParseDayOfWeek(
  parsedDate: Date,
  parsedElements: ParsedElements,
  parseOptions: ParseOptions,
) {
  const newWeekday = parsedElements.weekday as number
  if (!isUndefined(newWeekday) && newWeekday !== null && (newWeekday < 0 || newWeekday > 6)) {
    return C.INVALID_DATE
  }

  let modifiedDate = parsedDate

  // is this a valid date and do we have parsed the day of week?
  // if the source string contains a valid day of month, the weekday
  // is ignored (like moment.js does).
  if (
    !Number.isNaN(parsedDate.valueOf()) &&
    !isUndefined(newWeekday) &&
    isUndefined(parsedElements.day)
  ) {
    let newEsday: EsDay = parsedDateToEsday(parsedDate, parseOptions)
    if (isUndefined(parsedElements.weekYear) && isUndefined(parsedElements.week)) {
      newEsday = newEsday
        .month(parseOptions.currentMonth as number)
        .date(parseOptions.currentDay as number)
    }
    const modifiedEsday = newEsday.weekday(newWeekday)
    modifiedDate = modifiedEsday.toDate()
  }
  return modifiedDate
}

/**
 * Set weekYear of parsed date.
 * @param parsedDate - Date object returned by parsing function
 * @param parsedElements - object containing the components of a parsed date
 * @param parseOptions - parsing options e.g. containing the locale to use
 * @returns parsedDate with weekYear set to parsed value
 */
function postParseYear(
  parsedDate: Date,
  parsedElements: ParsedElements,
  parseOptions: ParseOptions,
) {
  let modifiedDate = parsedDate

  // is this a valid date and do we have parsed the weekYear?
  if (!Number.isNaN(parsedDate.valueOf()) && !isUndefined(parsedElements.weekYear)) {
    const newEsday: EsDay = parsedDateToEsday(parsedDate, parseOptions)
    const parsedWeekYear = parsedElements.weekYear as number

    if (Object.keys(parsedElements).length === 1) {
      // we parsed isoYear only ('gg' or 'gggg')
      let modifiedEsday = newEsday.weekYear(parsedWeekYear)
      modifiedEsday = modifiedEsday
        .year(parsedWeekYear)
        .month(parseOptions.currentMonth as number)
        .date(parseOptions.currentDay as number)
        .weekday(0)
      modifiedDate = modifiedEsday.toDate()
    } else if (!isUndefined(parsedElements.week)) {
      const modifiedEsday = newEsday.weekYear(parsedWeekYear)
      modifiedDate = modifiedEsday.toDate()
    }
  }
  return modifiedDate
}

const weekPlugin: EsDayPlugin<{}> = (_, dayClass, dayFactory) => {
  const proto = dayClass.prototype

  // @ts-expect-error function is compatible with its overload
  proto.week = function (newWeek?: number) {
    // Setter
    if (newWeek !== undefined) {
      // 'add(...,  C.DAY)' may change time, if we switch between DST and non-DST
      const currentWeekday = this.weekday()
      const h = this.hour()
      const m = this.minute()
      const s = this.second()
      const ms = this.millisecond()

      return this.add((newWeek - this.week()) * 7, C.DAY)
        .weekday(currentWeekday)
        .hour(h, m, s, ms)
    }

    // Getter
    const yearStart = this.localeObject?.().yearStart || C.INDEX_THURSDAY // default to Thursday according to ISO 8601
    if (this.month() === 11 && this.date() > 25) {
      const nextYearStartDay = this.startOf(C.YEAR).add(1, C.YEAR).date(yearStart)
      const thisEndOfWeek = this.endOf(C.WEEK)
      if (nextYearStartDay.isBefore(thisEndOfWeek)) {
        return 1
      }
    }
    const yearStartDay = this.startOf(C.YEAR).date(yearStart)
    const yearStartWeek = yearStartDay.startOf(C.WEEK).subtract(1, C.MS)
    const diffInWeek = this.diff(yearStartWeek, C.WEEK, true)
    if (diffInWeek < 0) {
      return this.startOf(C.WEEK).week()
    }
    return Math.ceil(diffInWeek)
  }

  proto.weeks = proto.week

  /**
   * Get or set the locale aware day of the week.
   * 0 is always the first day of the week (according to locale.weekStart property),
   * 6 is always the last day of the week.
   * E.g. in Europe 0=Monday ... 6=Sunday.
   * If no locale is loaded, Monday is used as start of week.
   */
  // @ts-expect-error function is compatible with its overload
  dayClass.prototype.weekday = function (newWeekday: number) {
    const weekStart = this.localeObject?.().weekStart ?? C.INDEX_MONDAY
    const dow = this.day() // day of week
    const weekday = (dow < weekStart ? dow + 7 : dow) - weekStart

    // Setter
    if (newWeekday !== undefined) {
      return this.subtract(weekday, C.DAY).add(newWeekday, C.DAY)
    }

    // Getter
    return weekday
  }

  /**
   * Gets or sets the year of the week. This year may differ from
   * the calendar year at the start or the end of a year (depending on
   * 'yearStart').
   * Setting the weekYear will keep the week number and the day of the week.
   * If no locale is loaded, Monday is used as start of week.
   */
  // @ts-expect-error function is compatible with its overload
  proto.weekYear = function (newWeekYear?: number) {
    // Setter
    if (newWeekYear !== undefined) {
      if (this.weekYear() === newWeekYear) {
        return this
      }
      const currentWeek = this.week()
      const currentWeekday = this.weekday()
      let newDate = this.year(newWeekYear).week(currentWeek).weekday(currentWeekday)
      if (newDate.weekYear() !== newWeekYear) {
        const yearDiff = newWeekYear - newDate.weekYear()
        newDate = newDate.add(yearDiff, C.YEAR).weekday(currentWeekday)
      }
      return newDate
    }

    // Getter
    const month = this.month()
    const weekOfYear = this.week()
    const year = this.year()
    if (weekOfYear === 1 && month === 11) {
      return year + 1
    }
    if (month === 0 && weekOfYear >= 52) {
      return year - 1
    }
    return year
  }

  /**
   * Get the number of weeks in the current year.
   * Most years have 52 weeks, some have 53 weeks.
   */
  proto.weeksInYear = function () {
    const weekStart = this.localeObject?.().weekStart ?? C.INDEX_MONDAY
    const yearStart = this.localeObject?.().yearStart ?? C.INDEX_THURSDAY
    const preWeekStart = (((weekStart + 6) % 7) + 8 - yearStart) % 7
    const prePreWeekStart = (preWeekStart + 6) % 7

    // get weekday of January 1st
    const yearStartWeekday = this.month(0).date(1).day()
    const year = this.year()
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    if (yearStartWeekday === preWeekStart || (isLeapYear && yearStartWeekday === prePreWeekStart)) {
      return 53
    }
    return 52
  }

  const oldStartOf = proto.startOf
  proto.startOf = function (units: UnitType) {
    if (units === C.WEEK) {
      let newDate = this.clone()
      // default start of week is Monday (according to ISO 8601)
      const weekStart = newDate.localeObject?.().weekStart ?? C.INDEX_MONDAY
      const newDateWeekday = newDate.day()
      const diff = (newDateWeekday < weekStart ? newDateWeekday + 7 : newDateWeekday) - weekStart
      const newDayOfMonth = newDate.date() - diff
      newDate = newDate.date(newDayOfMonth)
      return newDate['$set'](C.HOUR, [0, 0, 0, 0])
    }
    return oldStartOf.call(this, units)
  }

  const oldEndOf = proto.endOf
  proto.endOf = function (units: UnitType) {
    if (units === C.WEEK) {
      let newDate = this.clone()
      // default start of week is Monday (according to ISO 8601)
      const weekStart = newDate.localeObject?.().weekStart ?? C.INDEX_MONDAY
      const newDateWeekday = newDate.day()
      const diff = (newDateWeekday < weekStart ? newDateWeekday + 7 : newDateWeekday) - weekStart
      const newDayOfMonth = newDate.date() + (6 - diff)
      newDate = newDate.date(newDayOfMonth)
      return newDate['$set'](C.HOUR, [23, 59, 59, 999])
    }
    return oldEndOf.call(this, units)
  }

  // Add week related formatting tokens
  const additionalTokens: FormattingTokenDefinitions = {
    w: (sourceDate: EsDay) => sourceDate.week().toString(), // week 1..52
    ww: (sourceDate: EsDay) => padStart(sourceDate.week(), 2, '0'), // week 01..52
    wo: (sourceDate: EsDay) => toOrdinal(sourceDate, sourceDate.week()), // week 1st..52nd
    e: (sourceDate: EsDay) => sourceDate.weekday().toString(), // weekday 1..7
    gg: (sourceDate: EsDay) => padStart(sourceDate.weekYear(), 2, '0').slice(-2), // weekYear 70 .. 30
    gggg: (sourceDate: EsDay) => padStart(sourceDate.weekYear(), 4, '0'), // weekYear 1970 .. 2030
  }
  dayFactory.addFormatTokenDefinitions(additionalTokens)

  // Add week related parsing tokens
  const parseTokensDefinitions: TokenDefinitions = {
    w: [match1to2, match1to2NoLeadingZero, addWeekProperty('week'), postParseWeek], // isoWeek 1..52
    ww: [match1to2, match2, addWeekProperty('week'), postParseWeek], // isoWeek 01..52
    e: [match1to2, match1, addWeekProperty('weekday'), postParseDayOfWeek], // isoWeekday 1..7
    gg: [match1to4, match2, twoDigitsYearUpdater, postParseYear], // isoWeekYear 70 .. 30
    gggg: [match1to4, match4, addWeekProperty('weekYear'), postParseYear], // isoWeekYear 1970 .. 2030
  }
  dayFactory.addParseTokenDefinitions?.(parseTokensDefinitions)

  const oldParse = proto['parse']
  proto['parse'] = function (d?: Exclude<DateType, EsDay>) {
    // create required parseOptions
    const isUtc = this['$conf'].utc as boolean
    const parseOptions: ParseOptions = (this['$conf'].parseOptions as ParseOptions) ?? {}
    parseOptions.isUtc = isUtc

    // handle locale name(s) as argument; use the locale of 'this'
    // as the default value, if no locale is given as 3rd calling
    // parameter (1st parameter is the date string).
    let currentLocale = this.localeObject?.() ?? DEFAULT_LOCALE
    const arg2 = this['$conf'].args_2
    if (!isUndefined(arg2) && typeof arg2 === 'string') {
      currentLocale = getLocale(arg2)
    }

    parseOptions.locale = currentLocale.name

    // for setting weekday we need the current month and day
    // (in special situations)
    const now = new Date()
    parseOptions.currentMonth = now.getMonth()
    parseOptions.currentDay = now.getDate()
    this['$conf'].parseOptions = parseOptions
    oldParse.call(this, d)
  }
}

export default weekPlugin
