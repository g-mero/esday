/* eslint-disable dot-notation */
import type { EsDay } from '~/core'
import type { UnitType } from '~/types'
import { C, createInstanceFromExist, prettyUnit } from '~/common'

export function addImpl(that: EsDay, number: number, units: UnitType) {
  const $d = that['$d']
  const unit = prettyUnit(units)

  const instanceFactorySet = (multiplier: number) => {
    const newInstance = that.clone()
    newInstance['$d'].setDate($d.getDate() + Math.round(multiplier * number))
    return newInstance
  }

  if (unit === C.MONTH) {
    return that.set('month', that.get('month') + number)
  }
  if (unit === C.YEAR) {
    return that.set('year', that.get('year') + number)
  }
  if (unit === C.DATE || unit === C.DAY) {
    return instanceFactorySet(1)
  }
  if (unit === C.WEEK) {
    return instanceFactorySet(7)
  }

  // @ts-expect-error unit is string
  const step = {
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    second: 1000,
  }[unit] || 1 // 毫秒

  const nextTimeStamp = $d.getTime() + number * step
  return createInstanceFromExist(new Date(nextTimeStamp), that)
}
