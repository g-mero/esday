import type { UnitType } from '~/types'
import * as C from '../constant'
import { callDateGetOrSet, prettyUnit } from '../utils'

export function startOf(date: Date, unit: UnitType, utc: boolean, reverse = false) {
  const result = date

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
      const dayOfWeek = callDateGetOrSet(result, 'Day', utc)
      const diff = (dayOfWeek < 1 ? 7 : 0) + dayOfWeek - (reverse ? 6 : 0)
      callDateGetOrSet(result, 'Date', utc, callDateGetOrSet(result, 'Date', utc) - diff)
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
}
