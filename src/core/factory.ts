import type { DateType, EsDayFactory } from '~/types'
import { EsDay } from './EsDay'

// @ts-ignore plugin declare may cause ts-type-checke error, but it's ok
const esday: EsDayFactory = (d?: DateType, ...others: any[]) => {
  if (d instanceof EsDay) {
    return d.clone()
  }

  else {
    return new EsDay(d, ...others)
  }
}

esday.extend = (plugin, option) => {
  // @ts-expect-error plugin
  if (!plugin.$i) { // install plugin only once
    plugin(option as any, EsDay, esday)
    // @ts-expect-error plugin
    plugin.$i = true
  }
  return esday
}

export { esday }
