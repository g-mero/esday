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
export type UnitTypeAdd = Exclude<UnitTypePlurals, UnitIsoWeeks>

// Type as long unit from short unit (e.g. 'y' -> 'year')
export type PrettyUnit<T extends UnitType> = T extends ShortUnit ? (typeof UNIT_MAP)[T] : T
export type PrettyUnitPlurals<T extends UnitTypePlurals> = T extends ShortUnit
  ? (typeof UNIT_MAP)[T]
  : T

type UnionUnit<T extends ShortUnit> = T | PrettyUnit<T>
export type UnitYear = UnionUnit<'y'>
export type UnitQuarter = UnionUnit<'Q'>
export type UnitMonth = UnionUnit<'M'>
export type UnitWeek = UnionUnit<'w'>
export type UnitIsoWeek = UnionUnit<'W'>
export type UnitIsoWeeks = UnitIsoWeek | `${(typeof UNIT_MAP)['W']}${'s'}`
export type UnitDate = UnionUnit<'D'>
export type UnitDay = UnionUnit<'d'>
export type UnitHour = UnionUnit<'h'>
export type UnitMin = UnionUnit<'m'>
export type UnitSecond = UnionUnit<'s'>
export type UnitMs = UnionUnit<'ms'>

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
    normalizedUnit = unit?.toLowerCase()?.replace(/s$/, '') as LongUnit
  }
  return (normalizedUnit ?? unit) as PrettyUnitPlurals<T>
}
