import type { EsDayPlugin } from 'esday'
import { C } from '~/common'

declare module 'esday' {
  interface EsDay {
    week(): number
    week(week: number): EsDay
    weeks(): number
    weeks(week: number): EsDay
    weekYear: () => number
  }
}

const weekPlugin: EsDayPlugin<{}> = (_, dayClass) => {
  // @ts-expect-error function is compatible with its overload
  dayClass.prototype.week = function (week?: number) {
    // Setter
    if (week !== undefined) {
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
    const diffInWeek = this.diff(yearStartWeek, C.WEEK, true)
    if (diffInWeek < 0) {
      return this.startOf(C.WEEK).week()
    }
    return Math.ceil(diffInWeek)
  }

  dayClass.prototype.weeks = dayClass.prototype.week

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

export default weekPlugin
