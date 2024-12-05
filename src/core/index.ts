import type { DateType, EsDayFactory } from '~/types'
import { EsDay } from './EsDay'
import { parseDate } from './parseDate'

export * from './EsDay'

const esday: EsDayFactory = (d?: DateType) => {
  if (d instanceof EsDay) {
    return d
  }
  else {
    return new EsDay({
      d: parseDate(d),
      utc: false,
    })
  }
}

esday.extend = (plugin, option) => {
  // @ts-expect-error plugin
  if (!plugin.$i) { // install plugin only once
    plugin(option, EsDay, esday)
    // @ts-expect-error plugin
    plugin.$i = true
  }
  return esday
}

export { esday }
