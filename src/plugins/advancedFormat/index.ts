/**
 * advancedFormat plugin
 *
 * This plugin adds format definitions to date formatting
 */

import type { EsDay, EsDayFactory, EsDayPlugin, FormattingTokenDefinitions } from 'esday'
import { padStart, padZoneStr } from '~/common'

/**
 * Get the utcOffset of date.
 * Use the utcOffset method from the utc plugin if that is loaded;
 * otherwise get it from the javascript Date object of date.
 * @param date - EsDay instance to inspect
 * @returns utcOffset of date
 */
function utcOffset(date: EsDay): number {
  const defaultOffset = -Math.round(date['$d'].getTimezoneOffset()) || 0
  return 'utcOffset' in date ? date.utcOffset() : defaultOffset
}

const advancedFormatPlugin: EsDayPlugin<{}> = (
  _,
  _dayClass: typeof EsDay,
  dayFactory: EsDayFactory,
) => {
  // Extend formatting tokens
  const additionalTokens: FormattingTokenDefinitions = {
    d: (sourceDate: EsDay) => sourceDate.day().toString(),
    S: (sourceDate: EsDay) => padStart(sourceDate.millisecond(), 3, '0').slice(0, 1),
    SS: (sourceDate: EsDay) => padStart(sourceDate.millisecond(), 3, '0').slice(0, 2),
    ZZ: (sourceDate: EsDay) => padZoneStr(utcOffset(sourceDate)).replace(':', ''),
    X: (sourceDate: EsDay) => sourceDate.unix().toString(),
    x: (sourceDate: EsDay) => sourceDate.valueOf().toString(),
    k: (sourceDate: EsDay) => (sourceDate.hour() !== 0 ? sourceDate.hour() : 24).toString(),
    kk: (sourceDate: EsDay) => padStart(sourceDate.hour() !== 0 ? sourceDate.hour() : 24, 2, '0'),
  }
  dayFactory.addFormatTokenDefinitions(additionalTokens)
}

export default advancedFormatPlugin
