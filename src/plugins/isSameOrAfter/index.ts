import type { DateType, EsDayPlugin, UnitType } from 'esday'

declare module 'esday' {
  interface EsDay {
    isSameOrAfter: (that: DateType, unit?: UnitType) => boolean
  }
}

const isSameOrAfterPlugin: EsDayPlugin<{}> = (_, dayClass) => {
  dayClass.prototype.isSameOrAfter = function (that, unit) {
    return this.isSame(that, unit) || this.isAfter(that, unit)
  }
}

export default isSameOrAfterPlugin
