import { isArray, isObject } from '~/common'
import type { DateType, EsDayFactory } from '~/types'
import type { SimpleObject, SimpleType } from '~/types/util-types'
import { EsDay } from './EsDay'

// @ts-ignore plugin declare may cause ts-type-checke error, but it's ok
const esday: EsDayFactory = (
  d?: DateType,
  ...others: (SimpleType | string[] | { [key: string]: SimpleType })[]
) => {
  if (d instanceof EsDay) {
    return d.clone()
  }

  // calling parameters
  const conf: SimpleObject = {}
  others.forEach((o, i) => {
    if (isArray(o)) {
      conf[`args_${i + 1}`] = o
    } else if (isObject(o)) {
      Object.assign(conf, o)
    } else {
      conf[`args_${i + 1}`] = o
    }
  })
  return new EsDay(d, conf)
}

esday.extend = (plugin, option) => {
  // @ts-expect-error plugin
  if (!plugin.$i) {
    // install plugin only once
    plugin(option as any, EsDay, esday)
    // @ts-expect-error plugin
    plugin.$i = true
  }
  return esday
}

export { esday }
