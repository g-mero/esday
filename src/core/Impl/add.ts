/* eslint-disable dot-notation */
import type { UnitType } from '~/types'
import { EsDay } from '~/core'
import * as C from '../constant'
import { prettyUnit } from '../utils'

export function addImpl(that: EsDay, number: number, units: UnitType) {
  const $d = that['$d']
  const unit = prettyUnit(units)

  const instanceFactorySet = (multiplier: number) => {
    const newInstance = that.clone()
    newInstance['$d'].setDate($d.getDate() + Math.round(multiplier * number))
    return newInstance
  }

  if (unit === C.M) {
    return that.set('month', that.get('month') + number)
  }
  if (unit === C.Y) {
    return that.set('year', that.get('year') + number)
  }
  if (unit === C.DATE || unit === C.D) {
    return instanceFactorySet(1)
  }
  if (unit === C.W) {
    return instanceFactorySet(7)
  }

  // @ts-expect-error unit is string
  const step = {
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    second: 1000,
  }[unit] || 1 // 毫秒

  const nextTimeStamp = $d.getTime() + number * step
  return new EsDay({ d: new Date(nextTimeStamp), utc: that['$u'] })
}
