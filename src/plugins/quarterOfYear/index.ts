import type { EsDay, EsDayFactory, EsDayPlugin, FormattingTokenDefinitions, UnitType } from 'esday'
import { C, prettyUnit } from '~/common'

declare module 'esday' {
  interface EsDay {
    /**
     * overloads for getter / setter of locale of instance
     * quarter(): number
     * quarter(quarterNumber: number): EsDay
     */
    quarter: <T extends number | undefined = undefined>(
      quarterNumber?: T,
    ) => T extends number ? EsDay : number
  }
}

const quarterOfYearPlugin: EsDayPlugin<{}> = (_, dayClass, dayFactory: EsDayFactory) => {
  const proto = dayClass.prototype

  proto.quarter = function <T extends number | undefined = undefined>(
    quarterNumber?: T,
  ): T extends number ? EsDay : number {
    // Setter
    if (quarterNumber !== undefined) {
      // biome-ignore lint/suspicious/noExplicitAny: required to enable getter/setter function
      return this.month((this.month() % 3) + (quarterNumber - 1) * 3) as any
    }

    // Getter
    // biome-ignore lint/suspicious/noExplicitAny: required to enable getter/setter function
    return Math.ceil((this.month() + 1) / 3) as any
  }

  const oldAdd = proto.add
  proto.add = function (number: number, units: UnitType) {
    const unit = prettyUnit(units)
    if (unit === C.QUARTER) {
      return this.add(number * 3, C.MONTH)
    }

    return oldAdd.call(this, number, units)
  }

  const oldStartOf = proto.startOf
  proto.startOf = function (units: UnitType) {
    const unit = prettyUnit(units)
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
    const unit = prettyUnit(units)
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
