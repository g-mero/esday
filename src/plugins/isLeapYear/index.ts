import type { EsDayPlugin } from 'esday'

declare module 'esday' {
  interface EsDay {
    isLeapYear: () => boolean
  }
}

const isLeapYearPlugin: EsDayPlugin<{}> = (_, dayClass) => {
  dayClass.prototype.isLeapYear = function () {
    const year = this.year()
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)
  }
}

export default isLeapYearPlugin
