import type { EsDayPlugin } from 'esday'

declare module 'esday' {
  interface EsDay {
    dayOfYear: (() => number) & ((dayOfYear: number) => EsDay)
  }
}

const dayOfYearPlugin: EsDayPlugin<{}> = (_, dayClass, d) => {
  // @ts-expect-error is ok
  dayClass.prototype.dayOfYear = function (input?: number) {
    const dayOfYear =
      Math.round((d(this).startOf('day').valueOf() - d(this).startOf('year').valueOf()) / 864e5) + 1
    return input == null ? dayOfYear : this.add(input - dayOfYear, 'day')
  }
}

export default dayOfYearPlugin
