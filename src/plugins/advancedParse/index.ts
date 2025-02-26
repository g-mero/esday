/* eslint-disable dot-notation */
import type { DateFromDateComponents, DateType, EsDay, EsDayPlugin } from 'esday'
import { isArray, isString, isUndefined, isValidDate } from '~/common'

// Function to create a Date object from its date components
// is set to the corresponding function in the core module and
// requires the correct this context!
let dateFromDateComponents: DateFromDateComponents

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

interface ParsedElements {
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

interface parsedResultRaw {
  dateElements: ParsedElements
  charsLeftOver: number
  unusedTokens: number
  separatorsMatch: boolean
}

interface parsedResult {
  date: Date
  charsLeftOver: number
  unusedTokens: number
  separatorsMatch: boolean
}

// Helper functions
function parseTwoDigitYear(input: string): number {
  // 2-digitYears : use year+2000
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
  return parts[0] === '+' ? minutes : -minutes
}

/**
 * Create a function that will add a value from the input string
 * to the given object ('this') containing the date&time components.
 * @param property - name of the date&time component to add
 * @returns function that will add the given value to date&time component
 */
function addInput(property: keyof ParsedElements) {
  return function (this: ParsedElements, input: string | number) {
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
  return function (this: ParsedElements, input: string) {
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
function addUnixInput(isMilliseconds: boolean) {
  return function (this: ParsedElements, input: string) {
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
const parseTokensDefinitions: Record<string, [RegExp, RegExp, (this: ParsedElements, input: string) => void]> = {
  Q: [match1, match1, function (input) {
    this.month = (Number.parseInt(input, 10) - 1) * 3 + 1
  }],
  S: [matchUnsigned, match1, addMillisecondsToInput()],
  SS: [matchUnsigned, match2, addMillisecondsToInput()],
  SSS: [matchUnsigned, match3, addMillisecondsToInput()],
  s: [match1to2, match1to2, addInput('seconds')],
  ss: [match1to2, match2, addInput('seconds')],
  m: [match1to2, match1to2, addInput('minutes')],
  mm: [match1to2, match2, addInput('minutes')],
  H: [match1to2, match1to2, addInput('hours')],
  HH: [match1to2, match2, addInput('hours')],
  D: [match1to2, match1to2, addInput('day')],
  DD: [match1to2, match2, addInput('day')],
  x: [matchSigned, matchSigned, addUnixInput(true)],
  X: [matchTimestamp, matchTimestamp, addUnixInput(false)],
  M: [match1to2, match1to2, addInput('month')],
  MM: [match1to2, match2, addInput('month')],
  Y: [matchSigned, matchSigned, function (input) {
    this.year = Number.parseInt(input, 10)
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
 * object with the components of a date&time, the number of characters in input
 * not parsed and the number of unused token (i.e. not enough characters in input).
 * @param format - format to parse
 * @param isStrict - must input match format exactly?
 * @returns function that will parse an input string to a 'parsedResultRaw' object
 */
function makeParser(format: string, isStrict: boolean): (input: string, isStrict: boolean) => parsedResultRaw {
  const splittedFormat: any[] = format.match(formattingTokens) || []
  const length = splittedFormat.length
  for (let i = 0; i < length; i += 1) {
    const token = splittedFormat[i]
    const parseTo = parseTokensDefinitions[token]
    let regex
    if (!isStrict) {
      regex = parseTo && parseTo[0]
    }
    else {
      regex = parseTo && parseTo[1]
    }
    const parser = parseTo && parseTo[2]
    if (parser as any) {
      splittedFormat[i] = { regex, parser }
    }
    else {
      // remove escaped text from input string (e.g. "[H]")
      splittedFormat[i] = token.replace(/^\[|\]$/g, '')
    }
  }
  return function (input: string, isStrict: boolean): parsedResultRaw {
    let unusedTokens = 0
    let separatorsMatch = true
    const time: ParsedElements = {}
    for (let i = 0, start = 0; i < length; i += 1) {
      if (input.length === 0) {
        unusedTokens = splittedFormat.slice(i).reduce(
          (accumulator, currentValue) => accumulator + (isString(currentValue) ? 0 : 1),
          0,
        )
        break
      }

      const token = splittedFormat[i]
      // is this a separator (i.e. has typeof string)?
      if (isString(token)) {
        const separatorLength = token.length
        // in strict mode parsed date part must match format token!
        if (isStrict && separatorsMatch) {
          separatorsMatch &&= (input.substring(0, separatorLength) === token)
        }

        input = input.slice(separatorLength)
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

    const result: parsedResultRaw = {
      dateElements: time,
      charsLeftOver: input.length,
      unusedTokens,
      separatorsMatch,
    }
    return result
  }
}

/**
 * Create a Date from the tags generated by parsing the input string.
 * @param that - context for this function (required by dateFromDateComponents)
 * @param elements - object containing the tags generated by parsing the input string
 * @returns Date object created from the parsed data
 */
function parsedElementsToDate(that: EsDay, elements: ParsedElements) {
  const { year, month, day, hours, minutes, seconds, milliseconds, zoneOffset, unix } = elements

  if (Object.keys(elements).length === 0) {
    return invalidDate
  }

  if (!isUndefined(unix)) {
    return new Date(unix)
  }

  let offsetMs: number | undefined
  if (zoneOffset !== undefined) {
    offsetMs = (zoneOffset || 0) * 60000
  }

  return dateFromDateComponents.call(that, year, month, day, hours, minutes, seconds, milliseconds, offsetMs)
}

/**
 * Parse the given input using the given format and create a Date
 * object from the parsed elements.
 * @param that - context for this function (required by parsedElementsToDate)
 * @param input - string to be parsed
 * @param format - format to use
 * @param isStrict - must input match format exactly?
 * @returns Date object generated from the given data
 */
function parseFormattedInput(that: EsDay, input: string, format: string, isStrict: boolean): parsedResult {
  const parser = makeParser(format, isStrict)
  const parsedElements = parser(input, isStrict)
  const parsedDate = parsedElementsToDate(that, parsedElements.dateElements)

  return {
    date: parsedDate,
    charsLeftOver: parsedElements.charsLeftOver,
    unusedTokens: parsedElements.unusedTokens,
    separatorsMatch: parsedElements.separatorsMatch,

  }
}

const advancedParsePlugin: EsDayPlugin<{}> = (_, dayClass: typeof EsDay) => {
  const proto = dayClass.prototype

  const oldParse = proto['parse']
  proto['parse'] = function (d?: Exclude<DateType, EsDay>) {
    const format = this['$conf'].args_1
    const arg2 = this['$conf'].args_2
    const arg3 = this['$conf'].args_3

    let isStrict = false
    if (typeof arg2 === 'boolean') {
      isStrict = arg2
    }
    else if ((arg3 !== undefined) && (typeof arg3 === 'boolean')) {
      isStrict = arg3
    }

    if (isString(d)) {
      // format as single string
      if (isString(format)) {
        const parsingResult = parseFormattedInput(this, d, format, isStrict)
        this['$d'] = parsingResult.date
        if (isStrict && (
          (parsingResult.charsLeftOver > 0)
          || (parsingResult.unusedTokens > 0)
          || !parsingResult.separatorsMatch)
        ) {
          this['$d'] = invalidDate
        }
      }
      else if (isArray(format)) {
        // format as array string
        let bestDate = invalidDate
        let scoreToBeat
        let bestFormatIsValid = false
        for (let i = 0; i < format.length; i++) {
          let currentScore = 0
          let validFormatFound = false

          const formatUnderInspection = format[i]
          const parsingResult = parseFormattedInput(this, d, formatUnderInspection, isStrict)
          if (isStrict && (
            (parsingResult.charsLeftOver > 0)
            || (parsingResult.unusedTokens > 0)
            || !parsingResult.separatorsMatch)
          ) {
            parsingResult.date = invalidDate
          }

          if (isValidDate(parsingResult.date)) {
            validFormatFound = true
          }

          // if there are any unused tokens or if there is any input that was not parsed
          // add a penalty for that format
          currentScore += parsingResult.charsLeftOver
          currentScore += parsingResult.unusedTokens * 10

          // wait for valid date(s)
          if (!bestFormatIsValid) {
            if (
              isUndefined(scoreToBeat) // take the first parsed date whatever it is
              || currentScore < scoreToBeat // take better date (even invalid one)
              || validFormatFound // take first valid date
            ) {
              scoreToBeat = currentScore
              bestDate = parsingResult.date
              if (validFormatFound) {
                bestFormatIsValid = true
              }
            }
          }
          else {
            // evaluate only valid formats
            if (validFormatFound && !isUndefined(scoreToBeat) && (currentScore < scoreToBeat)) {
              scoreToBeat = currentScore
              bestDate = parsingResult.date
            }
          }
        }
        this['$d'] = bestDate
      }
    }
    else {
      oldParse.call(this, d)
    }
  }

  dateFromDateComponents = proto['dateFromDateComponents']
}

export default advancedParsePlugin
