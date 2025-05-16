/**
 * localizedParse plugin
 *
 * This plugin adds localized formats to advancedParse plugin
 *
 * used esday parameters in '$conf':
 *   args_1           format parameter in call signature
 *   args_2           2nd parameter in call signature
 *
 * esday parameters in '$conf' defined in advancedParse plugin:
 *   parseOptions     ParseOptions object containing parsing options
 *
 * new esday parameters in '$conf.parseOptions':
 *   locale           name of the locale to use when parsing
 *   isUtc            evaluate date as utc
 */

import type { DateType, EsDay, EsDayPlugin } from 'esday'
import { C, isArray, isString, isUndefined } from '~/common'
import type {
  DayNames,
  DayNamesStandaloneFormat,
  Locale,
  MonthNames,
  MonthNamesStandaloneFormat,
  ParseOptions,
  ParsedElements,
  TokenDefinitions,
} from '../index'
import { getLocale } from '../locale'

// Regular expressions for parsing
const match2 = /\d{2}/
const match1to2 = /\d\d?/
const matchWord = /\d*[^-_:/,()\s\d]+/

/**
 * Add 'input' to parsedElements as 'hours'.
 * @param parsedElements - object containing the components of a parsed date
 * @param input - parsed component of a date, to be transformed and inserted in parsedElements
 * @param options - parsing options e.g. containing the locale to use
 */
function addHour(parsedElements: ParsedElements, input: string, _parseOptions: ParseOptions) {
  parsedElements['hours'] = +input
}

/**
 * Convert parsed string to boolean 'afternoon'
 * @param locale - Locale to use
 * @param input - parsed date component
 * @param isLowerCase - should this be a lowercase meridiem string?
 * @returns is input an 'afternoon' string for given locale
 */
function meridiemMatch(locale: Locale, input: string, isLowerCase: boolean): boolean | undefined {
  let isAfternoon = undefined
  const { meridiem } = locale
  if (!meridiem) {
    isAfternoon = input === (isLowerCase ? 'pm' : 'PM')
  } else {
    for (let i = 1; i <= 24; i += 1) {
      if (input === meridiem(i, 0, isLowerCase)) {
        isAfternoon = i >= 12
        break
      }
    }
  }
  return isAfternoon
}

/**
 * Create a function that will parse the input string as meridiem string and
 * add it to the given 'parsedElements' containing the date&time components.
 * @param isLowerCase - parse the meridiem string as lowercase
 * @returns function that will add the given value to date&time component as 'afternoon'
 */
function addAfternoon(isLowerCase: boolean) {
  return function meridiemUpdater(
    parsedElements: ParsedElements,
    input: string,
    parseOptions: ParseOptions,
  ) {
    const localeName = parseOptions['locale'] as string
    const locale = getLocale(localeName)
    const meridiem = meridiemMatch(locale, input, isLowerCase)
    if (!isUndefined(meridiem)) {
      parsedElements.afternoon = meridiem
    }
  }
}

/**
 * Convert the hours to 24h format.
 * @param parsedDate - Date object returned by parsing function
 * @param parsedElements - object containing the components of a parsed date
 * @param parseOptions - parsing options e.g. containing the locale to use
 * @returns parsedDate with hours converted to 24h format
 */
function postParseMeridiem(
  parsedDate: Date,
  parsedElements: ParsedElements,
  parseOptions: ParseOptions,
) {
  const modifiedDate = parsedDate

  // is this a valid date and do we have parsed a meridiem?
  if (!Number.isNaN(parsedDate.valueOf()) && !isUndefined(parsedElements.afternoon)) {
    let parsedHours: number
    if (!parseOptions.isUtc) {
      parsedHours = parsedDate.getHours()
      if (parsedHours < 12 && parsedElements.afternoon) {
        modifiedDate.setHours(parsedHours + 12)
      } else if (parsedHours === 12 && !parsedElements.afternoon) {
        modifiedDate.setHours(0)
      }
    } else {
      parsedHours = parsedDate.getUTCHours()
      if (parsedHours < 12 && parsedElements.afternoon) {
        modifiedDate.setUTCHours(parsedHours + 12)
      } else if (parsedHours === 12 && !parsedElements.afternoon) {
        modifiedDate.setUTCHours(0)
      }
    }
  }
  return modifiedDate
}

/**
 * Parse day of month as ordinal number.
 * @param parsedElements - object containing the components of a parsed date
 * @param input - parsed component of a date, to be transformed and inserted in parsedElements
 * @param parseOptions - parsing options e.g. containing the locale to use
 */
function addDayOfMonthOrdinal(
  parsedElements: ParsedElements,
  input: string,
  parseOptions: ParseOptions,
) {
  const localeName = parseOptions['locale'] as string
  const { ordinal } = getLocale(localeName)
  let dateValue: number | undefined
  const splittedInput = input.match(/^[^\d]*(\d+)[^\d]*$/)
  if (splittedInput !== null) {
    dateValue = +splittedInput[1]
    const dateAsOrdinal = ordinal?.(dateValue)

    if (dateAsOrdinal === undefined || dateAsOrdinal === input) {
      parsedElements.day = dateValue
    }
  }
}

/**
 * Create a function that will convert the value from the input string
 * to a month number and add it to the given 'parsedElements' containing
 * the date&time components.
 * @param property - name of the list of month names to use
 * @returns function that will add the given value to date&time component
 */
function addMonth(property: 'months' | 'monthsShort') {
  return function monthUpdater(
    parsedElements: ParsedElements,
    input: string,
    parseOptions: ParseOptions,
  ) {
    const localeName = parseOptions['locale'] as string
    const months = getLocale(localeName)[property]
    let monthNames: MonthNames

    if (isArray(months)) {
      monthNames = months as MonthNames
    } else {
      monthNames = (months as MonthNamesStandaloneFormat).standalone
    }

    const matchIndex = monthNames.indexOf(input) + 1
    parsedElements.month = matchIndex % 12 || matchIndex
  }
}

/**
 * Create a function that will convert the value from the input string
 * to a day of week number and add it to the given 'parsedElements'
 * containing the date&time components.
 * @param property - name of the list of weekday names to use
 * @returns function that will add the weekday value to date&time component
 */
function addDayOfWeek(property: 'weekdays' | 'weekdaysShort' | 'weekdaysMin') {
  return function weekdayUpdater(
    parsedElements: ParsedElements,
    input: string,
    parseOptions: ParseOptions,
  ) {
    const localeName = parseOptions['locale'] as string
    const weekdays = getLocale(localeName)[property]
    let weekdayNames: DayNames

    if (isArray(weekdays)) {
      weekdayNames = weekdays as DayNames
    } else {
      weekdayNames = (weekdays as DayNamesStandaloneFormat).standalone
    }

    parsedElements.dayOfWeek = weekdayNames.indexOf(input)
  }
}

/**
 * Verify that parsed date is the expected day of week.
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
  let modifiedDate = parsedDate

  // is this a valid date and do we have parsed the day of week?
  if (!Number.isNaN(parsedDate.valueOf()) && !isUndefined(parsedElements.dayOfWeek)) {
    let parsedDay: number
    if (!parseOptions.isUtc) {
      parsedDay = parsedDate.getDay()
    } else {
      parsedDay = parsedDate.getUTCDay()
    }
    if (parsedDay !== parsedElements.dayOfWeek) {
      modifiedDate = C.INVALID_DATE
    }
  }
  return modifiedDate
}

/**
 * List of parsing tokens; the key of an entry in this list is
 * the token to be parsed and the value is a 3-entries-array with
 * the 1st entry being the regex for parsing in 'standard' mode,
 * the 2nd entry being the regex for parsing in 'strict' mode and
 * the 3rd entry being a function that will add the corresponding
 * value to an object containing all the date&time elements (year,
 * month, day, ...).
 */
const parseTokensDefinitions: TokenDefinitions = {
  h: [match1to2, match1to2, addHour],
  hh: [match1to2, match2, addHour],
  a: [matchWord, matchWord, addAfternoon(true), postParseMeridiem],
  A: [matchWord, matchWord, addAfternoon(false), postParseMeridiem],
  dd: [matchWord, matchWord, addDayOfWeek('weekdaysMin'), postParseDayOfWeek],
  ddd: [matchWord, matchWord, addDayOfWeek('weekdaysShort'), postParseDayOfWeek],
  dddd: [matchWord, matchWord, addDayOfWeek('weekdays'), postParseDayOfWeek],
  Do: [matchWord, matchWord, addDayOfMonthOrdinal],
  MMM: [matchWord, matchWord, addMonth('monthsShort')],
  MMMM: [matchWord, matchWord, addMonth('months')],
}

/**
 * Replace locale dependent token in given format with values from locale definition
 * e.g. 'LTS' with 'h:mm:ss A'
 * @param format - original format (with locale dependent tokens)
 * @param currentLocale - Locale to use
 * @returns format with locale dependent tokens replaced
 */
function replaceLocaleTokens(format: string, currentLocale: Locale) {
  const localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g
  function replaceLongDateFormatTokens(input: string) {
    return currentLocale.formats[input as keyof typeof currentLocale.formats] ?? input
  }

  return format.replace(localFormattingTokens, replaceLongDateFormatTokens)
}

const localizedParsePlugin: EsDayPlugin<{}> = (_, dayClass, dayFactory) => {
  const proto = dayClass.prototype

  // add new parsing tokens to existing list of parsing tokens
  dayFactory.addParseTokenDefinitions(parseTokensDefinitions)

  const oldParse = proto['parse']
  proto['parse'] = function (d?: Exclude<DateType, EsDay>) {
    if (!isString(d)) {
      oldParse.call(this, d)
      return
    }

    // only string dates can be parsed
    const format = this['$conf'].args_1

    // create required parseOptions
    const isUtc = this['$conf'].utc as boolean
    const parseOptions: ParseOptions = (this['$conf'].parseOptions as ParseOptions) ?? {}
    parseOptions.isUtc = isUtc

    // handle locale name(s) as argument; use the locale of 'this'
    // as the default value, if no locale is given as 3rd calling
    // parameter (1st parameter is the date string).
    let currentLocale = this.localeObject()
    const arg2 = this['$conf'].args_2
    if (!isUndefined(arg2) && typeof arg2 === 'string') {
      currentLocale = getLocale(arg2)
    }

    parseOptions.locale = currentLocale.name
    this['$conf'].parseOptions = parseOptions

    let newFormat = format
    if (isString(newFormat)) {
      newFormat = replaceLocaleTokens(newFormat, currentLocale)
    } else if (isArray(newFormat)) {
      // replace locale dependent tokens in all formats (if array)
      for (let i = 0; i < newFormat.length; i++) {
        newFormat[i] = replaceLocaleTokens(newFormat[i], currentLocale)
      }
    }

    // use modified format for parsing
    this['$conf'].args_1 = newFormat

    // run preParse if exists
    let newDate = d
    if (currentLocale.preParse !== undefined) {
      newDate = currentLocale.preParse(d)
    }

    oldParse.call(this, newDate)
  }
}

export default localizedParsePlugin
