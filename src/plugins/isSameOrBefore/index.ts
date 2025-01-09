import type { DateType, EsDayPlugin, UnitType } from 'esday'

declare module 'esday' {
  interface EsDay {
    isSameOrBefore: (that: DateType, unit?: UnitType) => boolean
  }
}

const isSameOrBeforePlugin: EsDayPlugin<{}> = (_, dayClass) => {
  dayClass.prototype.isSameOrBefore = function (that, unit) {
    return this.isSame(that, unit) || this.isBefore(that, unit)
  }
}

export default isSameOrBeforePlugin
