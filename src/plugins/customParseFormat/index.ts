/* eslint-disable dot-notation */
import type { DateType, EsDay, EsDayPlugin } from 'esday'
import { isString } from '~/common'

const formattingTokens
  = /(\[[^[]*\])|([-_:/.,()\s]+)|([AaQz]|YYYY|YY?|ww?|MM?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|ZZ?)/g

// Regular expressions for parsing
const match1 = /\d/
const match2 = /\d{2}/
const match3 = /\d{3}/
const match4 = /\d{4}/
const match1to2 = /\d\d?/
const matchSigned = /[+-]?\d+/
const matchOffset = /[+-]\d\d:?(\d\d)?|Z/

interface Time {
  afternoon?: boolean
  year?: number
  month?: number
  day?: number
  hours?: number
  minutes?: number
  seconds?: number
  milliseconds?: number
  zone?: { offset: number }
  week?: number
}

// Helper functions
function parseTwoDigitYear(input: string): number {
  const year = +input
  return year + (year > 68 ? 1900 : 2000)
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

function addInput(property: keyof Time) {
  return function (this: Time, input: string) {
    // @ts-expect-error xxx
    this[property] = +input
  }
}

// Define parsing expressions
const expressions: Record<string, [RegExp, (this: Time, input: string) => void]> = {
  A: [match1, function () {
    this.afternoon = true
  }],
  a: [match1, function () {
    this.afternoon = true
  }],
  Q: [match1, function (input) {
    this.month = (Number.parseInt(input, 10) - 1) * 3 + 1
  }],
  S: [match1, function (input) {
    this.milliseconds = +input * 100
  }],
  SS: [match2, function (input) {
    this.milliseconds = +input * 10
  }],
  SSS: [match3, function (input) {
    this.milliseconds = +input
  }],
  s: [match1to2, addInput('seconds')],
  ss: [match1to2, addInput('seconds')],
  m: [match1to2, addInput('minutes')],
  mm: [match1to2, addInput('minutes')],
  H: [match1to2, addInput('hours')],
  h: [match1to2, addInput('hours')],
  HH: [match1to2, addInput('hours')],
  hh: [match1to2, addInput('hours')],
  D: [match1to2, addInput('day')],
  DD: [match2, addInput('day')],
  Do: [match1to2, function (input) {
    this.day = Number.parseInt(input.match(/\d+/)?.[0] || '0', 10)
  }],
  w: [match1to2, addInput('week')],
  ww: [match2, addInput('week')],
  M: [match1to2, addInput('month')],
  MM: [match2, addInput('month')],
  Y: [matchSigned, addInput('year')],
  YY: [match2, function (input) {
    this.year = parseTwoDigitYear(input)
  }],
  YYYY: [match4, addInput('year')],
  Z: [matchOffset, function (input) {
    this.zone = { offset: offsetFromString(input) }
  }],
  ZZ: [matchOffset, function (input) {
    this.zone = { offset: offsetFromString(input) }
  }],
}

// Correct hours based on AM/PM
function correctHours(time: Time) {
  if (time.afternoon !== undefined) {
    if (time.hours !== undefined) {
      if (time.afternoon) {
        if (time.hours < 12)
          time.hours += 12
      }
      else if (time.hours === 12) {
        time.hours = 0
      }
    }
    delete time.afternoon
  }
}

// Build parser
function makeParser(format: string): (input: string) => Time {
  const array: any[] = format.match(formattingTokens) || []
  const { length } = array
  for (let i = 0; i < length; i += 1) {
    const token = array[i]
    const parseTo = expressions[token]
    const regex = parseTo && parseTo[0]
    const parser = parseTo && parseTo[1]
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
      if (typeof token === 'string') {
        start += token.length
      }
      else {
        const { regex, parser } = token
        const part = input.slice(start)
        const match = regex.exec(part)
        const value = match[0]
        parser.call(time, value)
        input = input.replace(value, '')
      }
    }
    correctHours(time)
    return time
  }
}

// Parse formatted input
function parseFormattedInput(input: string, format: string, utc: boolean): Date {
  try {
    const parser = makeParser(format)
    const { year, month, day, hours, minutes, seconds, milliseconds, zone } = parser(input)

    if (utc) {
      return new Date(Date.UTC(year || 0, (month || 1) - 1, day || 1, hours || 0, minutes || 0, seconds || 0, milliseconds || 0))
    }
    if (zone) {
      const offsetMs = (zone.offset || 0) * 60000
      return new Date(Date.UTC(year || 0, (month || 1) - 1, day || 1, hours || 0, minutes || 0, seconds || 0, milliseconds || 0) - offsetMs)
    }
    return new Date(year || 0, (month || 1) - 1, day || 1, hours || 0, minutes || 0, seconds || 0, milliseconds || 0)
  }
  catch {
    return new Date(Number.NaN)
  }
}

const customParseFormatPlugin: EsDayPlugin<{}> = (_, dayTsClass: typeof EsDay) => {
  const oldParse = dayTsClass.prototype['parse']
  dayTsClass.prototype['parse'] = function (d?: Exclude<DateType, EsDay>) {
    const format = this['$conf'].args_1

    if (isString(d) && isString(format)) {
      // utc plugin compatibility
      const date = parseFormattedInput(d, format, !!this['$conf'].utc)

      if (Number.isNaN(date.getTime())) {
        this['$d'] = new Date('')
      }
      else {
        this['$d'] = date
      }
    }
    else {
      oldParse.call(this, d)
    }
  }
}

export default customParseFormatPlugin
