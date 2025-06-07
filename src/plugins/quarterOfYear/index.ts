/**
 * quarterOfYear plugin
 *
 * This plugin adds 'quarter' and the formatting token 'Q' to EsDay.
 */

import type { EsDay, EsDayPlugin, FormattingTokenDefinitions } from 'esday'
import { C, normalizeUnitWithPlurals } from '~/common'
import type { UnitType, UnitTypeAdd } from '~/types'

declare module 'esday' {
  interface EsDay {
    quarter(): number
    quarter(quarterNumber: number): EsDay
  }
}

const quarterOfYearPlugin: EsDayPlugin<{}> = (_, dayClass, dayFactory) => {
  const proto = dayClass.prototype

  // @ts-expect-error function is compatible with its overload
  proto.quarter = function (quarterNumber?: number) {
    if (quarterNumber === undefined) {
      // Getter
      return Math.ceil((this.month() + 1) / 3)
    }

    // Setter
    return this.month((this.month() % 3) + (quarterNumber - 1) * 3)
  }

  const oldAdd = proto.add
  proto.add = function (number: number, units: UnitTypeAdd) {
    const unit = normalizeUnitWithPlurals(units)
    if (unit === C.QUARTER) {
      return this.add(number * 3, C.MONTH)
    }

    return oldAdd.call(this, number, units)
  }

  const oldStartOf = proto.startOf
  proto.startOf = function (units: UnitType) {
    const unit = normalizeUnitWithPlurals(units)
    if (unit === C.QUARTER) {
      const quarter = this.quarter() - 1
      return this.month(quarter * 3)
        .startOf(C.MONTH)
        .startOf(C.DAY)
    }
    return oldStartOf.call(this, units)
  }

  const oldEndOf = proto.endOf
  proto.endOf = function (units: UnitType) {
    const unit = normalizeUnitWithPlurals(units)
    if (unit === C.QUARTER) {
      const quarter = this.quarter() - 1
      return this.month(quarter * 3 + 2)
        .endOf(C.MONTH)
        .endOf(C.DAY)
    }
    return oldEndOf.call(this, units)
  }

  // Add 'Q' for quarter to formatting tokens
  const additionalTokens: FormattingTokenDefinitions = {
    Q: (sourceDate: EsDay) => sourceDate.quarter().toString(),
  }
  dayFactory.addFormatTokenDefinitions(additionalTokens)
}

export default quarterOfYearPlugin
