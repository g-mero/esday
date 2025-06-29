import {
  DAY,
  DAY_OF_MONTH,
  HOUR,
  ISOWEEK,
  MIN,
  MONTH,
  MS,
  QUARTER,
  SECOND,
  WEEK,
  YEAR,
} from './constants'

const UNIT_MAP = {
  y: YEAR,
  Q: QUARTER,
  M: MONTH,
  w: WEEK,
  W: ISOWEEK,
  D: DAY_OF_MONTH,
  d: DAY,
  h: HOUR,
  m: MIN,
  s: SECOND,
  ms: MS,
} as const

export type ShortUnit = keyof typeof UNIT_MAP
export type LongUnit = (typeof UNIT_MAP)[ShortUnit]
export type LongUnitPlurals = `${(typeof UNIT_MAP)[ShortUnit]}${'s'}`

export type UnitType = ShortUnit | LongUnit
export type UnitTypePlurals = UnitType | LongUnitPlurals
export type UnitTypeCore = Exclude<UnitType, UnitWeek | UnitIsoWeek | UnitQuarter>
export type UnitTypeAddSub = Exclude<UnitTypePlurals, UnitIsoWeeks>
export type UnitTypeGetSet = Exclude<UnitTypePlurals, UnitIsoWeeks>

// Type as long unit from short or long unit (e.g. 'y' -> 'year')
export type PrettyUnit<T extends UnitType> = T extends ShortUnit ? (typeof UNIT_MAP)[T] : T

// Type as plural long unit from short, long or plural unit (e.g. 'years' -> 'year')
export type PrettyUnitPlurals<T extends UnitTypePlurals> = T extends ShortUnit
  ? `${(typeof UNIT_MAP)[T]}`
  : T extends `${infer P}s`
    ? P
    : T

type UnionUnit<T extends ShortUnit> = T | PrettyUnit<T> | PrettyUnitPlurals<T>
export type UnitYear = UnionUnit<'y'>
export type UnitYears = UnitYear | `${(typeof UNIT_MAP)['y']}${'s'}`
export type UnitQuarter = UnionUnit<'Q'>
export type UnitQuarters = UnitQuarter | `${(typeof UNIT_MAP)['Q']}${'s'}`
export type UnitMonth = UnionUnit<'M'>
export type UnitMonths = UnitMonth | `${(typeof UNIT_MAP)['M']}${'s'}`
export type UnitWeek = UnionUnit<'w'>
export type UnitWeeks = UnitWeek | `${(typeof UNIT_MAP)['w']}${'s'}`
export type UnitIsoWeek = UnionUnit<'W'>
export type UnitIsoWeeks = UnitIsoWeek | `${(typeof UNIT_MAP)['W']}${'s'}`
export type UnitDate = UnionUnit<'D'>
export type UnitDates = UnitDate | `${(typeof UNIT_MAP)['D']}${'s'}`
export type UnitDay = UnionUnit<'d'>
export type UnitDays = UnitDay | `${(typeof UNIT_MAP)['d']}${'s'}`
export type UnitHour = UnionUnit<'h'>
export type UnitHours = UnitHour | `${(typeof UNIT_MAP)['h']}${'s'}`
export type UnitMin = UnionUnit<'m'>
export type UnitMins = UnitMin | `${(typeof UNIT_MAP)['m']}${'s'}`
export type UnitSecond = UnionUnit<'s'>
export type UnitSeconds = UnitSecond | `${(typeof UNIT_MAP)['s']}${'s'}`
export type UnitMs = UnionUnit<'ms'>
export type UnitMss = UnitMs | `${(typeof UNIT_MAP)['ms']}${'s'}`

// Convert any unit to its long form (e.g. 'y' or 'year' -> 'year')
export function normalizeUnit<T extends UnitType>(unit: T): PrettyUnit<T> {
  const maybePrettyUnit = UNIT_MAP[unit as ShortUnit]
  return (maybePrettyUnit || unit) as PrettyUnit<T>
}

// Convert any unit (incl. plural form) to its long form (without plural)
// (e.g. 'y' or 'year' or 'years' -> 'year')
export function normalizeUnitWithPlurals<T extends UnitTypePlurals>(unit: T): PrettyUnitPlurals<T> {
  let normalizedUnit = UNIT_MAP[unit as ShortUnit]
  if (normalizedUnit === undefined) {
    normalizedUnit = unit?.toLowerCase?.().replace?.(/s$/, '') as LongUnit
  }
  return (normalizedUnit ?? unit) as PrettyUnitPlurals<T>
}
