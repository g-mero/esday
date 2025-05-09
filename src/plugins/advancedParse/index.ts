/**
 * advancedParse plugin
 *
 * This plugin adds format definitions to date parsing
 *
 * used esday parameters in '$conf':
 *   args_1           format parameter in call signature
 *   args_2           2nd parameter in call signature
 *   args_3           3rd parameter in call signature
 *
 * new esday parameters in '$conf':
 *   parseOptions     ParseOptions object containing parsing options
 */

import type { DateFromDateComponents, DateType, EsDay, EsDayFactory, EsDayPlugin } from 'esday'
import { isArray, isString, isUndefined, isValidDate } from '~/common'
import type {
  ParseOptions,
  ParsedElements,
  ParsedResultRaw,
  Parser,
  PostParser,
  TokenDefinitions,
  UpdateParsedElement,
} from './types'

// Function to create a Date object from its date components
// is set to the corresponding function in the core module and
// requires the correct this context (e.g. for the utc plugin)!
let dateFromDateComponents: DateFromDateComponents

const invalidDate = new Date('')

const formattingSeparatorsRegex = '(\\[[^[]*\\])|([-_:/.,()\\s]+)'
let formattingTokensRegex: RegExp

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

/**
 * Definition of parser that handles 1 token in the parsing format.
 * The parser is derived from the TokenDefinitions by selecting the
 * right regex (depending on normal or strict mode) and the related
 * update function.
 */
interface ParserDefinition {
  regex: RegExp
  updater: UpdateParsedElement
}

/**
 * Result of parsing after converting the parsed elements to
 * a Date object.
 */
interface ParsedResult {
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
  return +input
}

function offsetFromString(offset: string): number {
  if (!offset) return 0
  if (offset === 'Z') return 0
  const parts = offset.match(/([+-]|\d\d)/g)
  if (!parts) return 0
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
  return (parsedElements: ParsedElements, input: string) => {
    if (property !== 'afternoon') {
      parsedElements[property] = +input
    }
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
  return (parsedElements: ParsedElements, input: string) => {
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
    parsedElements.milliseconds = value
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
  return (parsedElements: ParsedElements, input: string) => {
    let value = +input
    if (isMilliseconds) {
      value = Number.parseInt(input, 10)
    } else {
      value = Number.parseFloat(input) * 1000
    }
    parsedElements.unix = value
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
const parseTokensDefinitions: TokenDefinitions = {
  Q: [
    match1,
    match1,
    (parsedElements: ParsedElements, input: string) => {
      parsedElements.month = (Number.parseInt(input, 10) - 1) * 3 + 1
    },
  ],
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
  Y: [
    matchSigned,
    matchSigned,
    (parsedElements: ParsedElements, input: string) => {
      parsedElements.year = Number.parseInt(input, 10)
    },
  ],
  YY: [
    match1to4,
    match2,
    (parsedElements: ParsedElements, input: string) => {
      parsedElements.year = parseTwoDigitYear(input)
    },
  ],
  YYYY: [
    match1to4,
    match4,
    (parsedElements: ParsedElements, input: string) => {
      parsedElements.year = parseFourDigitYear(input)
    },
  ],
  Z: [
    matchOffset,
    matchOffset,
    (parsedElements: ParsedElements, input: string) => {
      parsedElements.zoneOffset = offsetFromString(input)
    },
  ],
  ZZ: [
    matchOffset,
    matchOffset,
    (parsedElements: ParsedElements, input: string) => {
      parsedElements.zoneOffset = offsetFromString(input)
    },
  ],
}

// Get regex from list of supported tokens
/**
 * Compare 2 tokens for sorting.
 * Longer token and upper case token are sorted to the top.
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
function formattingTokensRegexFromDefinitions() {
  // we have to sort the keys to always catch the longest matches
  const tokenKeys = Object.keys(parseTokensDefinitions).sort(compareTokens)
  formattingTokensRegex = new RegExp(`${formattingSeparatorsRegex}|(${tokenKeys.join('|')})`, 'g')
}

/**
 * Build a parser that will parse an input string an return an
 * object with the components of a date&time, the number of characters in input
 * not parsed and the number of unused token (i.e. not enough characters in input).
 * Must be called in the context of an EsDay instance.
 * @param this - context for this function (required by updater function of parsed element definition)
 * @param format - format to parse
 * @param isStrict - must input match format exactly?
 * @returns function that will parse an input string to a 'parsedResultRaw' object
 */
function makeParser(format: string, isStrict: boolean): { parser: Parser; postParser: PostParser } {
  const splittedFormat: Array<string> =
    (format.match(formattingTokensRegex) as Array<string>) || ([] as Array<string>)
  const length = splittedFormat.length
  const parsingDefinitions = Array<string | ParserDefinition>(length)
  const postParseHandlers = Array<PostParser>()

  for (let i = 0; i < length; i += 1) {
    const token = splittedFormat[i]
    const parseTo = parseTokensDefinitions[token]
    let regex: RegExp | undefined

    if (!isStrict) {
      regex = parseTo?.[0]
    } else {
      regex = parseTo?.[1]
    }

    const updater = parseTo?.[2]
    if (!isUndefined(updater)) {
      parsingDefinitions[i] = { regex, updater }
    } else {
      // remove escaped text from input string (e.g. "[H]")
      parsingDefinitions[i] = token.replace(/^\[|\]$/g, '')
    }

    const postParseHandler = parseTo?.[3]
    if (postParseHandler !== undefined && !postParseHandlers.includes(postParseHandler)) {
      postParseHandlers.push(postParseHandler)
    }
  }

  const parser = (
    input: string,
    isStrict: boolean,
    parseOptions: ParseOptions,
  ): ParsedResultRaw => {
    let unusedTokens = 0
    let separatorsMatch = true
    const parsedDateElements: ParsedElements = {}

    for (let i = 0, start = 0; i < length; i += 1) {
      if (input.length === 0) {
        unusedTokens = parsingDefinitions
          .slice(i)
          .reduce((accumulator, currentValue) => accumulator + (isString(currentValue) ? 0 : 1), 0)
        break
      }

      const token = parsingDefinitions[i]

      // is this a separator (i.e. has typeof string)?
      if (isString(token)) {
        const separatorLength = token.length
        // in strict mode parsed date part must match format token!
        if (isStrict && separatorsMatch) {
          separatorsMatch &&= input.substring(0, separatorLength) === token
        }
        // biome-ignore lint/style/noParameterAssign: <explanation>
        input = input.slice(separatorLength)
      } else {
        const { regex, updater } = token
        const part = input.slice(start)
        const match = regex.exec(part)
        if (match !== null) {
          const value = match[0]
          // biome-ignore lint/style/noParameterAssign: <explanation>
          input = input.replace(value, '')
          updater(parsedDateElements, value, parseOptions)
        }
      }
    }

    const result: ParsedResultRaw = {
      dateElements: parsedDateElements,
      charsLeftOver: input.length,
      unusedTokens,
      separatorsMatch,
    }
    return result
  }

  const postParser = (
    parsedDate: Date,
    parsedElements: ParsedElements,
    parseOptions: ParseOptions,
  ): Date => {
    let modifiedParsedDate = parsedDate
    for (let i = 0; i < postParseHandlers.length; i++) {
      modifiedParsedDate = postParseHandlers[i](modifiedParsedDate, parsedElements, parseOptions)
    }

    return modifiedParsedDate
  }

  return { parser, postParser }
}

/**
 * Create a Date from the tags generated by parsing the input string.
 * Must be called in the context of an EsDay instance.
 * @param this - context for this function (required by dateFromDateComponents)
 * @param elements - object containing the tags generated by parsing the input string
 * @returns Date object created from the parsed data
 */
function parsedElementsToDate(this: EsDay, elements: ParsedElements) {
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

  return dateFromDateComponents.call(
    this,
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    milliseconds,
    offsetMs,
  )
}

/**
 * Parse the given input using the given format and create a Date
 * object from the parsed elements.
 * Must be called in the context of an EsDay instance.
 * @param this - context for this function (required by parsedElementsToDate)
 * @param input - string to be parsed
 * @param format - format to use
 * @param isStrict - must input match format exactly?
 * @param parseOptions - options for parser and postParser
 * @returns Date object generated from the given data
 */
function parseFormattedInput(
  this: EsDay,
  input: string,
  format: string,
  isStrict: boolean,
  parseOptions: ParseOptions,
): ParsedResult {
  const { parser, postParser } = makeParser(format, isStrict)
  const parsedElements = parser(input, isStrict, parseOptions)
  let parsedDate = parsedElementsToDate.call(this, parsedElements.dateElements)
  parsedDate = postParser(parsedDate, parsedElements.dateElements, parseOptions)

  return {
    date: parsedDate,
    charsLeftOver: parsedElements.charsLeftOver,
    unusedTokens: parsedElements.unusedTokens,
    separatorsMatch: parsedElements.separatorsMatch,
  }
}

/**
 * Add parsing tokens to list of global parsing tokens.
 * @param newTokens - list of new parsing token definitions
 */
function addParseTokenDefinitions(newTokens: TokenDefinitions) {
  // add all entries from newTokens into parseTokensDefinitions (without duplicates!)
  for (const key in newTokens) {
    if (!Object.prototype.hasOwnProperty.call(parseTokensDefinitions, key)) {
      parseTokensDefinitions[key] = newTokens[key]
    }
  }

  formattingTokensRegexFromDefinitions()
}

const advancedParsePlugin: EsDayPlugin<{}> = (
  _,
  dayClass: typeof EsDay,
  dayFactory: EsDayFactory,
) => {
  const proto = dayClass.prototype

  // get regexp to separate format into formatting tokens and separators
  formattingTokensRegexFromDefinitions()

  const oldParse = proto['parse']
  proto['parse'] = function (d?: Exclude<DateType, EsDay>) {
    const format = this['$conf'].args_1
    const arg2 = this['$conf'].args_2
    const arg3 = this['$conf'].args_3
    const parseOptions: ParseOptions = (this['$conf'].parseOptions as ParseOptions) ?? {}

    let isStrict = false
    if (typeof arg2 === 'boolean') {
      isStrict = arg2
    } else if (arg3 !== undefined && typeof arg3 === 'boolean') {
      isStrict = arg3
    }

    if (isString(d)) {
      // format as single string
      if (isString(format)) {
        const parsingResult = parseFormattedInput.call(this, d, format, isStrict, parseOptions)
        this['$d'] = parsingResult.date
        if (
          isStrict &&
          (parsingResult.charsLeftOver > 0 ||
            parsingResult.unusedTokens > 0 ||
            !parsingResult.separatorsMatch)
        ) {
          this['$d'] = invalidDate
        }
      } else if (isArray(format)) {
        // format as array string
        let bestDate = invalidDate
        let scoreToBeat = 0
        let bestFormatIsValid = false
        for (let i = 0; i < format.length; i++) {
          let currentScore = 0
          let validFormatFound = false

          const formatUnderInspection = format[i]
          const parsingResult = parseFormattedInput.call(
            this,
            d,
            formatUnderInspection,
            isStrict,
            parseOptions,
          )
          if (
            isStrict &&
            (parsingResult.charsLeftOver > 0 ||
              parsingResult.unusedTokens > 0 ||
              !parsingResult.separatorsMatch)
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
              isUndefined(scoreToBeat) || // take the first parsed date whatever it is
              currentScore < scoreToBeat || // take better date (even invalid one)
              validFormatFound // take first valid date
            ) {
              scoreToBeat = currentScore
              bestDate = parsingResult.date
              if (validFormatFound) {
                bestFormatIsValid = true
              }
            }
          } else {
            // evaluate only valid formats
            if (validFormatFound && !isUndefined(scoreToBeat) && currentScore < scoreToBeat) {
              scoreToBeat = currentScore
              bestDate = parsingResult.date
            }
          }
        }
        this['$d'] = bestDate
      }
    } else {
      oldParse.call(this, d)
    }
  }

  dateFromDateComponents = proto['dateFromDateComponents']

  dayFactory.addParseTokenDefinitions = addParseTokenDefinitions
}

export default advancedParsePlugin
