import { isArray } from './is'
import type { PrettyUnitPlurals, UnitDays, UnitTypeGetSet } from './units'
import { normalizeUnitWithPlurals } from './units'

const UNIT_FIELD_MAP = {
  year: 'FullYear',
  month: 'Month',
  date: 'Date',
  day: 'Day',
  hour: 'Hours',
  minute: 'Minutes',
  second: 'Seconds',
  millisecond: 'Milliseconds',
} as const

type DateUnit = keyof typeof UNIT_FIELD_MAP
type DateField<T extends DateUnit> = (typeof UNIT_FIELD_MAP)[T]

export const prettyUnits = Object.keys(UNIT_FIELD_MAP) as (keyof typeof UNIT_FIELD_MAP)[]

export function unitToField<T extends UnitTypeGetSet>(unit: T): DateField<PrettyUnitPlurals<T>> {
  const p = normalizeUnitWithPlurals(unit)
  return UNIT_FIELD_MAP[p]
}

export function getUnitInDate(date: Date, unit: UnitTypeGetSet): number {
  const field = unitToField(unit)
  const method = `get${field}` as `get${typeof field}`
  return date[method]()
}

export function getUnitInDateUTC(date: Date, unit: UnitTypeGetSet): number {
  const field = unitToField(unit)
  return date[`getUTC${field}` as `getUTC${typeof field}`]()
}

export function setUnitInDate(
  date: Date,
  unit: Exclude<UnitTypeGetSet, UnitDays>,
  value: number | number[],
): Date {
  const field = unitToField(unit)
  const method = `set${field}` as `set${typeof field}`
  date[method](...((isArray(value) ? value : [value]) as [number]))
  return date
}

export function setUnitInDateUTC(
  date: Date,
  unit: Exclude<UnitTypeGetSet, UnitDays>,
  value: number | number[],
): Date {
  const field = unitToField(unit)
  const method = `setUTC${field}` as `setUTC${typeof field}`
  date[method](...((isArray(value) ? value : [value]) as [number]))
  return date
}
