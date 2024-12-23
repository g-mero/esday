/* eslint-disable dot-notation */
import type { EsDay } from 'esday'
import type { UnitType } from '~/types'
import * as C from '../constant'
import { callDateGetOrSet, prettyUnit, wrapperInst } from '../utils'

export function startOfImpl(that: EsDay, unit: UnitType, reverse = false) {
  const result = that.toDate()

  const utc = that['$u']

  const instanceFactorySet = (method: string, slice: number) => {
    const argumentStart = [0, 0, 0, 0]
    const argumentEnd = [23, 59, 59, 999]
    const argument = reverse ? argumentEnd.slice(slice) : argumentStart.slice(slice)
    callDateGetOrSet(result, method as any, utc, argument)
  }

  const instanceFactory = (d: number, m: number) => {
    callDateGetOrSet(result, 'Month', utc, [m, d])
  }

  const $M = callDateGetOrSet(result, 'Month', utc)
  const $D = callDateGetOrSet(result, 'Date', utc)
  const $W = callDateGetOrSet(result, 'Day', utc)

  switch (prettyUnit(unit)) {
    case C.Y:
      reverse ? instanceFactory(31, 11) : instanceFactory(1, 0)
      instanceFactorySet('Hours', 0)
      break
    case C.M:
      reverse ? instanceFactory(0, $M + 1) : instanceFactory(1, $M)
      instanceFactorySet('Hours', 0)
      break
    case C.W:
    {
      // default start of week is Monday
      // according to ISO 8601
      const dayOfWeekMonday = 1
      const weekStart = dayOfWeekMonday
      const diff = ($W < weekStart ? $W + 7 : $W) - weekStart
      instanceFactory(reverse ? $D + (6 - diff) : $D - diff, $M)
      instanceFactorySet('Hours', 0)
      break
    }
    case C.D:
    case C.DATE:
      instanceFactorySet('Hours', 0)
      break
    case C.H:
      instanceFactorySet('Minutes', 1)
      break
    case C.MIN:
      instanceFactorySet('Seconds', 2)
      break
    case C.S:
      instanceFactorySet('Milliseconds', 3)
      break
  }

  return wrapperInst(result, that)
}
