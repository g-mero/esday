export const SECONDS_A_MINUTE = 60
export const SECONDS_A_HOUR = SECONDS_A_MINUTE * 60
export const SECONDS_A_DAY = SECONDS_A_HOUR * 24
export const SECONDS_A_WEEK = SECONDS_A_DAY * 7

export const MILLISECONDS_A_SECOND = 1e3
export const MILLISECONDS_A_MINUTE = SECONDS_A_MINUTE * MILLISECONDS_A_SECOND
export const MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND
export const MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND
export const MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND

export const INDEX_MONDAY = 1

// English locales
// 'as const' is required to make these values usable as units
export const MS = 'millisecond' as const
export const S = 'second' as const
export const MIN = 'minute' as const
export const H = 'hour' as const
export const D = 'day' as const
export const W = 'week' as const
export const M = 'month' as const
export const Q = 'quarter' as const
export const Y = 'year' as const
export const DATE = 'date' as const

export const FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ss'

export const INVALID_DATE_STRING = 'Invalid Date'

// regex
// eslint-disable-next-line regexp/no-misleading-capturing-group
export const REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[T\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/i
export const REGEX_FORMAT = /\[([^\]]+)\]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g
