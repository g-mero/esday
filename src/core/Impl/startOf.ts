import type { EsDay } from 'esday'
import type { UnitType } from '~/types'
import { prettyUnit } from '~/utils'
import * as C from '../constant'

export function startOfImpl(that: EsDay, unit: UnitType, reverse = false) {
  const result = that.clone()

  // for performance , $set can change inst itself
  // eslint-disable-next-line dot-notation
  const setterFunc = result['$set']

  const instanceFactorySet = (method: 'h' | 'm' | 's' | 'ms', slice: number) => {
    const argumentStart = [0, 0, 0, 0]
    const argumentEnd = [23, 59, 59, 999]
    const argument = reverse ? argumentEnd.slice(slice) : argumentStart.slice(slice)
    setterFunc.call(result, method, argument)
  }

  const instanceFactory = (date: number, month: number) => {
    setterFunc.call(result, 'M', [month, date])
  }

  const $month = result.month()
  const $date = result.date()
  const $day = result.day()

  switch (prettyUnit(unit)) {
    case C.YEAR:
      reverse ? instanceFactory(31, 11) : instanceFactory(1, 0)
      instanceFactorySet('h', 0)
      break
    case C.MONTH:
      reverse ? instanceFactory(0, $month + 1) : instanceFactory(1, $month)
      instanceFactorySet('h', 0)
      break
    case C.WEEK:
    {
      // default start of week is Monday
      // according to ISO 8601
      const weekStart = C.INDEX_MONDAY
      const diff = ($day < weekStart ? $day + 7 : $day) - weekStart
      instanceFactory(reverse ? $date + (6 - diff) : $date - diff, $month)
      instanceFactorySet('h', 0)
      break
    }
    case C.DAY:
    case C.DATE:
      instanceFactorySet('h', 0)
      break
    case C.HOUR:
      instanceFactorySet('m', 1)
      break
    case C.MIN:
      instanceFactorySet('s', 2)
      break
    case C.SECOND:
      instanceFactorySet('ms', 3)
      break
  }

  return result
}
