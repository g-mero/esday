import type { EsDayPlugin } from 'esday'
import { C } from '~/common'

declare module 'esday' {
  interface EsDay {
    week: (() => number) & ((week: number) => EsDay)
    weeks: (() => number) & ((week: number) => EsDay)
  }
}

const weekOfYearPlugin: EsDayPlugin<{}> = (_, dayClass) => {
  // @ts-expect-error function is compatible with its overload
  dayClass.prototype.week = function (week?: number) {
    // Setter
    if (week) {
      return this.add((week - this.week()) * 7, C.DAY)
    }

    // Getter
    const yearStart = this.localeObject?.().yearStart || C.INDEX_THURSDAY // default to Thursday according to ISO 8601
    if (this.month() === 11 && this.date() > 25) {
      const nextYearStartDay = this.startOf(C.YEAR).add(1, C.YEAR).date(yearStart)
      const thisEndOfWeek = this.endOf(C.WEEK)
      if (nextYearStartDay.isBefore(thisEndOfWeek)) {
        return 1
      }
    }
    const yearStartDay = this.startOf(C.YEAR).date(yearStart)
    const yearStartWeek = yearStartDay.startOf(C.WEEK).subtract(1, C.MS)
    // TODO to avoid problems with (local) DST rules,
    // we must calculate the diff in days or use utc (?)
    const diffInWeek = (this.valueOf() - yearStartWeek.valueOf()) / C.MILLISECONDS_A_WEEK
    if (diffInWeek < 0) {
      return this.startOf(C.WEEK).week()
    }
    return Math.ceil(diffInWeek)
  }

  dayClass.prototype.weeks = dayClass.prototype.week
}

export default weekOfYearPlugin
