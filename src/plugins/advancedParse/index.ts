/* eslint-disable dot-notation */
import type { DateType, EsDay, EsDayPlugin } from 'esday'
import { isString, isUndefined } from '~/common'

const invalidDate = new Date('')

const formattingTokens
  = /(\[[^[]*\])|([-_:/.,()\s]+)|(YYYY|YY?|MM?|DD?|hh?|HH?|mm?|ss?|S{1,3}|ZZ?|[QXx])/g

// Regular expressions for parsing
const match1 = /\d/
const match2 = /\d{2}/
const match3 = /\d{3}/
const match4 = /\d{4}/
const match1to2 = /\d\d?/
const match1to4 = /\d{1,4}/
const matchSigned = /[+-]?\d+/
const matchUnsigned = /\d+/
const matchTimestamp = /[+-]?\d+(\.\d{1,3})?/ // 123456789 123456789.123
const matchOffset = /[+-]\d\d:?(\d\d)?|Z/

interface Time {
  year?: number
  month?: number
  day?: number
  hours?: number
  minutes?: number
  seconds?: number
  milliseconds?: number
  zoneOffset?: number
  unix?: number
}

// Helper functions
function parseTwoDigitYear(input: string): number {
  const inputLimited = input.slice(0, 2)
  const year = +inputLimited
  return year + (year > 68 ? 1900 : 2000)
}

function parseFourDigitYear(input: string): number {
  if (input.length === 2) {
    return parseTwoDigitYear(input)
  }
  else {
    return +input
  }
}

function offsetFromString(offset: string): number {
  if (!offset)
    return 0
  if (offset === 'Z')
    return 0
  const parts = offset.match(/([+-]|\d\d)/g)
  if (!parts)
    return 0
  const minutes = +parts[1] * 60 + (+parts[2] || 0)
  return parts[0] === '+' ? -minutes : minutes
}

/**
 * Create a function that will add a value from the input string
 * to the given object ('this') containing the date&time components.
 * @param property - name of the date&time component to add
 * @returns function that will add the given value to date&time component
 */
function addInput(property: keyof Time) {
  return function (this: Time, input: string | number) {
    this[property] = +input
  }
}

/**
 * Create a function that will add a milliseconds value from the input
 * string to the given object ('this') containing the date&time components.
 * If the input string has more than 3 characters, only the first 3 characters
 * get evaluated.
 * @returns function that will add the given value to the milliseconds property of date&time component
 */
function addMillisecondsToInput() {
  return function (this: Time, input: string) {
    const inputLimited = input.slice(0, 3)
    let value = +inputLimited
    switch (inputLimited.length) {
      case 1:
        value *= 100
        break
      case 2:
        value *= 10
        break
    }
    this.milliseconds = value
  }
}

/**
 * Create a function that will add a unix timestamp value from the input
 * string to the given object ('this') containing the date&time components.
 * If the input string contains a dot character, the value is interpreted as
 * seconds and converted to milliseconds.
 * @returns function that will add the given value to the milliseconds property of date&time component
 */
function addUnixToInput(isMilliseconds: boolean) {
  return function (this: Time, input: string) {
    let value = +input
    if (isMilliseconds) {
      value = Number.parseInt(input, 10)
    }
    else {
      value = Number.parseFloat(input) * 1000
    }
    this.unix = value
  }
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
// TODO signature of function must include 'strict' to be used in conversion function (e.g. in MS)
const expressions: Record<string, [RegExp, RegExp, (this: Time, input: string) => void]> = {
  Q: [match1, match1, function (input) {
    this.month = (Number.parseInt(input, 10) - 1) * 3 + 1
  }],
  S: [matchUnsigned, match1, addMillisecondsToInput()],
  SS: [matchUnsigned, match2, addMillisecondsToInput()],
  SSS: [matchUnsigned, match3, addMillisecondsToInput()],
  s: [match1to2, match1, addInput('seconds')],
  ss: [match1to2, match2, addInput('seconds')],
  m: [match1to2, match1to2, addInput('minutes')],
  mm: [match1to2, match2, addInput('minutes')],
  H: [match1to2, match1to2, addInput('hours')],
  h: [match1to2, match1to2, addInput('hours')],
  HH: [match1to2, match2, addInput('hours')],
  hh: [match1to2, match2, addInput('hours')],
  D: [match1to2, match1to2, addInput('day')],
  DD: [match1to2, match2, addInput('day')],
  x: [matchSigned, matchSigned, addUnixToInput(true)],
  X: [matchTimestamp, matchTimestamp, addUnixToInput(false)],
  M: [match1to2, match1to2, addInput('month')],
  MM: [match1to2, match2, addInput('month')],
  Y: [match1to4, match1to2, function (input) {
    this.year = parseTwoDigitYear(input)
  }],
  YY: [match1to4, match2, function (input) {
    this.year = parseTwoDigitYear(input)
  }],
  YYYY: [match1to4, match4, function (input) {
    this.year = parseFourDigitYear(input)
  }],
  Z: [matchOffset, matchOffset, function (input) {
    this.zoneOffset = offsetFromString(input)
  }],
  ZZ: [matchOffset, matchOffset, function (input) {
    this.zoneOffset = offsetFromString(input)
  }],
}

/**
 * Build a parser that will parse an input string an return an
 * object with the components of a date&time.
 * @param format - format to parse
 * @returns function that will parse an input string to a 'time' object
 */
function makeParser(format: string): (input: string) => Time {
  const array: any[] = format.match(formattingTokens) || []
  const { length } = array
  for (let i = 0; i < length; i += 1) {
    const token = array[i]
    const parseTo = expressions[token]
    const regex = parseTo && parseTo[0]
    // TODO this is for non-strict-mode only
    const parser = parseTo && parseTo[2]
    if (parser as any) {
      array[i] = { regex, parser }
    }
    else {
      array[i] = token.replace(/^\[|\]$/g, '')
    }
  }
  return function (input: string): Time {
    const time: Time = {}
    for (let i = 0, start = 0; i < length; i += 1) {
      const token = array[i]
      // if (typeof token === 'string') {
      if (isString(token)) {
        start += token.length
      }
      else {
        const { regex, parser } = token
        const part = input.slice(start)
        const match = regex.exec(part)
        if (match !== null) {
          const value = match[0]
          input = input.replace(value, '')
          parser.call(time, value)
        }
      }
    }
    return time
  }
}

/**
 * Parse the given input using the given format and create a Date
 * object from the parsed elements.
 * @param input - string to be parsed
 * @param format - format to use
 * @param utc - will this become an utc date&time?
 * @returns Date object generated from the given data
 */
function parseFormattedInput(input: string, format: string, utc: boolean): Date {
  try {
    const parser = makeParser(format)
    const parsedElements = parser(input)
    const { year, month, day, hours, minutes, seconds, milliseconds, zoneOffset, unix } = parsedElements

    if (Object.keys(parsedElements).length === 0) {
      return invalidDate
    }

    if (!isUndefined(unix)) {
      return new Date(unix)
    }

    if (utc) {
      return new Date(Date.UTC(year || 0, (month || 1) - 1, day || 1, hours || 0, minutes || 0, seconds || 0, milliseconds || 0))
    }

    if (zoneOffset !== undefined) {
      const offsetMs = (zoneOffset || 0) * 60000
      return new Date(Date.UTC(year || 0, (month || 1) - 1, day || 1, hours || 0, minutes || 0, seconds || 0, milliseconds || 0) - offsetMs)
    }

    return new Date(year || 0, (month || 1) - 1, day || 1, hours || 0, minutes || 0, seconds || 0, milliseconds || 0)
  }
  catch {
    return invalidDate
  }
}

const advancedParsePlugin: EsDayPlugin<{}> = (_, dayTsClass: typeof EsDay) => {
  const oldParse = dayTsClass.prototype['parse']
  dayTsClass.prototype['parse'] = function (d?: Exclude<DateType, EsDay>) {
    // TODO use more than 1 additional parameter e..g. 'esday(date, format, strict)
    const format = this['$conf'].args_1

    // TODO format could be an array
    if (isString(d) && isString(format)) {
      // utc plugin compatibility
      const date = parseFormattedInput(d, format, !!this['$conf'].utc)
      this['$d'] = date
    }
    else {
      oldParse.call(this, d)
    }
  }
}

export default advancedParsePlugin
