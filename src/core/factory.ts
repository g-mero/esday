import type { DateType, EsDayFactory } from '~/types'
import { EsDay } from './EsDay'

const esday: EsDayFactory = (d?: DateType, config?: {
  utc?: boolean
}) => {
  if (d instanceof EsDay) {
    return d
  }
  else {
    return new EsDay({
      d,
      utc: false,
      ...config,
    })
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
