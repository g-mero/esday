import type { PrettyUnit, UnitDay, UnitType, UnitWeek } from './units'
import { isArray } from './is'
import { prettyUnit } from './units'

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
type DateField<T extends DateUnit > = typeof UNIT_FIELD_MAP[T]

export function unitToField<T extends Exclude<UnitType, UnitWeek>>(unit: T): DateField<PrettyUnit<T>> {
  const p = prettyUnit(unit)
  return UNIT_FIELD_MAP[p]
}

export function getUnitInDate(date: Date, unit: Exclude<UnitType, UnitWeek>, utc?: boolean): number {
  const field = unitToField(unit)
  const method = `get${utc ? 'UTC' : ''}${field}` as (`get${typeof field}` | `getUTC${typeof field}`)
  return date[method]()
}

export function setUnitInDate(date: Date, unit: Exclude<UnitType, UnitWeek | UnitDay>, value: number | number[], utc?: boolean): Date {
  const field = unitToField(unit)
  const method = `set${utc ? 'UTC' : ''}${field}` as (`set${typeof field}` | `setUTC${typeof field}`)
  date[method](...(isArray(value) ? value : [value]) as [number])
  return date
}
