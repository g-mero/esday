import type { DateType, EsDayPlugin, UnitType } from 'esday'
import { C } from '~/common'

declare module 'esday' {
  interface EsDay {
    /**
     * returns a boolean indicating if a date is between two other dates
     *
     * @example
     * const date = new EsDay('2021-01-01')
     * date.isBetween('2020-01-01', '2022-01-01') // true
     * date.isBetween('2021-01-01', '2022-01-01') // false
     * date.isBetween('2020-01-01', '2022-01-01', 'date') // true
     * date.isBetween('2020-01-01', '2022-01-01', 'date', '[]') // true
     * date.isBetween('2020-01-01', '2022-01-01', 'date', '()') // false
     */
    isBetween: (
      from: DateType,
      to: DateType,
      unit?: UnitType,
      inclusivity?: '()' | '[]' | '[)' | '(]'
    ) => boolean
  }
}

const isBetweenPlugin: EsDayPlugin<{}> = (_, dayClass) => {
  dayClass.prototype.isBetween = function (
    from: DateType,
    to: DateType,
    unit: UnitType = C.MS,
    inclusivity: '()' | '[]' | '[)' | '(]' = '()',
  ) {
    const includeFrom = inclusivity[0] === '['
    const includeTo = inclusivity[1] === ']'

    const isAfterFrom = includeFrom ? !this.isBefore(from, unit) : this.isAfter(from, unit)
    const isBeforeTo = includeTo ? !this.isAfter(to, unit) : this.isBefore(to, unit)

    return isAfterFrom && isBeforeTo
  }
}

export default isBetweenPlugin
