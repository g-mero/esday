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
export type PrettyUnitType = (typeof UNIT_MAP)[ShortUnit]
export type UnitType = ShortUnit | PrettyUnitType
export type UnitTypeCore = Exclude<UnitType, UnitWeek | UnitIsoWeek | UnitQuarter>
export type UnitTypeAdd = Exclude<UnitType, UnitIsoWeek>
export type PrettyUnit<T extends UnitType> = T extends ShortUnit ? (typeof UNIT_MAP)[T] : T
type UnionUnit<T extends ShortUnit> = T | PrettyUnit<T>
export type UnitYear = UnionUnit<'y'>
export type UnitQuarter = UnionUnit<'Q'>
export type UnitMonth = UnionUnit<'M'>
export type UnitWeek = UnionUnit<'w'>
export type UnitIsoWeek = UnionUnit<'W'>
export type UnitDate = UnionUnit<'D'>
export type UnitDay = UnionUnit<'d'>
export type UnitHour = UnionUnit<'h'>
export type UnitMin = UnionUnit<'m'>
export type UnitSecond = UnionUnit<'s'>
export type UnitMs = UnionUnit<'ms'>

export function prettyUnit<T extends UnitType>(u: T): PrettyUnit<T> {
  const maybePrettyUnit = UNIT_MAP[u as ShortUnit]
  return (maybePrettyUnit || u) as PrettyUnit<T>
}
