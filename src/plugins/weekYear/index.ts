import type { EsDayPlugin } from 'esday'

declare module 'esday' {
  interface EsDay {
    weekYear: () => number
  }
}

export const weekYearPlugin: EsDayPlugin<{}> = (_, dayClass) => {
  dayClass.prototype.weekYear = function () {
    const month = this.month()
    const weekOfYear = this.week()
    const year = this.year()
    if (weekOfYear === 1 && month === 11) {
      return year + 1
    }
    if (month === 0 && weekOfYear >= 52) {
      return year - 1
    }
    return year
  }
}

export default weekYearPlugin
