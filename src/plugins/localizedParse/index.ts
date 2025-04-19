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

import type { DateType, EsDay, EsDayFactory, EsDayPlugin } from 'esday'
import { C, isArray, isString, isUndefined } from '~/common'
import type {
  Locale,
  LocaleFormatKeys,
  MonthNamesFunction,
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
function addHour(parsedElements: ParsedElements, input: string, _options: ParseOptions) {
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
 * @param isLowerCase - parse the meridiem string as lowercase)
 * @returns function that will add the given value to date&time component as 'afternoon'
 */
function addAfternoon(isLowerCase: boolean) {
  return function meridiemUpdater(
    parsedElements: ParsedElements,
    input: string,
    options: ParseOptions,
  ) {
    const localeName = options['locale'] as string
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
 * @param options - parsing options e.g. containing the locale to use
 * @returns parsedDate with hours converted to 24h format
 */
function postParseMeridiem(
  parsedDate: Date,
  parsedElements: ParsedElements,
  options: ParseOptions,
) {
  const modifiedDate = parsedDate

  // is this a valid date and do we have parsed a meridiem?
  if (!Number.isNaN(parsedDate.valueOf()) && !isUndefined(parsedElements.afternoon)) {
    let parsedHours: number
    if (!options.isUtc) {
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
 * @param options - parsing options e.g. containing the locale to use
 */
function addDayOfMonthOrdinal(
  parsedElements: ParsedElements,
  input: string,
  options: ParseOptions,
) {
  const localeName = options['locale'] as string
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
    options: ParseOptions,
  ) {
    const localeName = options['locale'] as string
    let monthNames = getLocale(localeName)[property]
    if (!isArray(monthNames)) {
      monthNames = (monthNames as MonthNamesFunction).standalone
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
    options: ParseOptions,
  ) {
    const localeName = options['locale'] as string
    const weekdayNames = getLocale(localeName)[property]
    parsedElements.dayOfWeek = weekdayNames.indexOf(input)
  }
}

/**
 * Verify that parsed date is the expected day of week.
 * @param parsedDate - Date object returned by parsing function
 * @param parsedElements - object containing the components of a parsed date
 * @param options - parsing options e.g. containing the locale to use
 * @returns parsedDate or invalid date (if day of week does not match)
 */
function postParseDayOfWeek(
  parsedDate: Date,
  parsedElements: ParsedElements,
  options: ParseOptions,
) {
  let modifiedDate = parsedDate

  // is this a valid date and do we have parsed the day of week?
  if (!Number.isNaN(parsedDate.valueOf()) && !isUndefined(parsedElements.dayOfWeek)) {
    let parsedDay: number
    if (!options.isUtc) {
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
 * Compare 2 parsing tokens for sorting.
 * Longer tokens and upper case tokens are sorted to the top.
 * @param a - token 1
 * @param b - token 2
 * @returns -1 (a<b), 0 (a==b), 1 (a>b)
 */
function compareTokens(a: string, b: string) {
  if (a.length < b.length) {
    return 1
  }

  if (a.length > b.length) {
    return -1
  }

  // length are equal, so compare values
  if (a < b) {
    return 1
  }

  if (a > b) {
    return -1
  }

  // are equal
  return 0
}

/**
 * Replace locale dependent token in given format with values from locale definition
 * e.g. 'LTS' with 'h:mm:ss A'
 * @param format - original format (with locale dependent tokens)
 * @param currentLocale - Locale to use
 * @returns format with locale dependent tokens replaced
 */
function replaceLocaleTokens(format: string, currentLocale: Locale) {
  let newFormat = format
  const currentLocaleFormats = currentLocale.formats

  // replace format tokens from locale; we have to sort
  // the keys to always catch the longest matches first
  const tokenKeys = Object.keys(currentLocaleFormats).sort(compareTokens)

  for (let i = 0; i < tokenKeys.length; i++) {
    const tokenToReplace: LocaleFormatKeys = tokenKeys[i] as LocaleFormatKeys
    const newValue = currentLocaleFormats[tokenToReplace]
    newFormat = newFormat.replace(tokenToReplace, newValue)
  }
  return newFormat
}

const localizedParsePlugin: EsDayPlugin<{}> = (
  _,
  dayClass: typeof EsDay,
  dayFactory: EsDayFactory,
) => {
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
    const isUtc = this['$conf'].utc as boolean
    const parseOptions = { isUtc } as ParseOptions
    this['$conf'].parseOptions = parseOptions

    // handle locale name(s) as argument; use the locale of 'this'
    // as the default value, if no locale is given as 3rd calling
    // parameter (1st parameter is the date string).
    let currentLocale = this.localeObject()
    const arg2 = this['$conf'].args_2
    if (!isUndefined(arg2) && typeof arg2 === 'string') {
      currentLocale = getLocale(arg2)
    }

    this['$conf'].parseOptions.locale = currentLocale.name
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
