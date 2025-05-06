/**
 * week plugin
 *
 * This plugin adds 'week', 'weeks', 'weekday', 'weekYear', 'weeksInYear'
 * and the formatting tokens 'GGGG' to EsDay
 *
 * This plugin requires the 'locale' plugin and a locale to be loaded.
 * For the 'wo' formatting token, the 'localizedFormat' plugin is required too.
 */

import type { EsDay, EsDayPlugin } from 'esday'
import { C, padStart, prettyUnit } from '~/common'
import type { FormattingTokenDefinitions, UnitType } from '~/types'

declare module 'esday' {
  interface EsDay {
    week(): number
    week(week: number): EsDay
    weeks(): number
    weeks(week: number): EsDay
    weekday(): number
    weekday(weekday: number): EsDay
    weekYear(): number
    weekYear(newWeekYear: number): EsDay
    weeksInYear(): number
  }
}

/**
 * Convert a number to an ordinal number, if a locale is available.
 * Otherwise return value as string.
 * @param sourceDate - date to take the locale from
 * @param value - value to convert
 * @returns value as ordinal
 */
function toOrdinal(sourceDate: EsDay, value: number) {
  const defaultValue = value.toString()
  return sourceDate.localeObject?.().ordinal(value) ?? defaultValue
}

const weekPlugin: EsDayPlugin<{}> = (_, dayClass, dayFactory) => {
  const proto = dayClass.prototype

  // @ts-expect-error function is compatible with its overload
  proto.week = function (week?: number) {
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

  proto.weeks = proto.week

  /**
   * Get or set the locale aware day of the week.
   * 0 is always the first day of the week (according to locale.weekStart property),
   * 6 is always the last day of the week.
   * E.g. in Europe 0=Monday ... 6=Sunday.
   * If no locale is loaded, Monday is used as start of week.
   */
  // @ts-expect-error function is compatible with its overload
  dayClass.prototype.weekday = function (newWeekday: number) {
    const weekStart = this.localeObject?.().weekStart ?? C.INDEX_MONDAY
    const currentWeekday = this.day()
    const weekday = (currentWeekday < weekStart ? currentWeekday + 7 : currentWeekday) - weekStart

    // Setter
    if (newWeekday !== undefined) {
      return this.subtract(weekday, C.DAY).add(newWeekday, C.DAY)
    }

    // Getter
    return weekday
  }

  /**
   * Gets or sets the year of the week. This year may differ from
   * the calendar year at the start or the end of a year (depending on
   * 'yearStart').
   * Setting the weekYear will keep the week number and the day of the week.
   * If no locale is loaded, Monday is used as start of week.
   */
  // @ts-expect-error function is compatible with its overload
  proto.weekYear = function (newWeekYear?: number) {
    // Setter
    if (newWeekYear !== undefined) {
      if (this.week() === newWeekYear) {
        return this
      }
      const currentWeek = this.week()
      const currentWeekday = this.weekday()
      let newDate = this.year(newWeekYear).week(currentWeek).weekday(currentWeekday)
      if (newDate.weekYear() !== newWeekYear) {
        const yearDiff = newWeekYear - newDate.weekYear()
        newDate = newDate.add(yearDiff, C.YEAR).weekday(currentWeekday)
      }
      return newDate
    }

    // Getter
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

  /**
   * Get the number of weeks in the current year.
   * Most years have 52 weeks, some have 53 weeks.
   */
  proto.weeksInYear = function () {
    const weekStart = this.localeObject?.().weekStart ?? C.INDEX_MONDAY
    const yearStart = this.localeObject?.().yearStart ?? C.INDEX_THURSDAY
    const preWeekStart = (((weekStart + 6) % 7) + 8 - yearStart) % 7
    const prePreWeekStart = (preWeekStart + 6) % 7

    // get weekday of January 1st
    const yearStartWeekday = this.month(0).date(1).day()
    const year = this.year()
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    if (yearStartWeekday === preWeekStart || (isLeapYear && yearStartWeekday === prePreWeekStart)) {
      return 53
    }
    return 52
  }

  const oldStartOf = proto.startOf
  proto.startOf = function (units: UnitType) {
    const unit = prettyUnit(units)
    if (unit === C.WEEK) {
      let newDate = this.clone()
      // default start of week is Monday (according to ISO 8601)
      const weekStart = newDate.localeObject?.().weekStart ?? C.INDEX_MONDAY
      const newDateWeekday = newDate.day()
      const diff = (newDateWeekday < weekStart ? newDateWeekday + 7 : newDateWeekday) - weekStart
      const newDayOfMonth = newDate.date() - diff
      newDate = newDate.date(newDayOfMonth)
      return newDate['$set'](C.HOUR, [0, 0, 0, 0])
    }
    return oldStartOf.call(this, units)
  }

  const oldEndOf = proto.endOf
  proto.endOf = function (units: UnitType) {
    const unit = prettyUnit(units)
    if (unit === C.WEEK) {
      let newDate = this.clone()
      // default start of week is Monday (according to ISO 8601)
      const weekStart = newDate.localeObject?.().weekStart ?? C.INDEX_MONDAY
      const newDateWeekday = newDate.day()
      const diff = (newDateWeekday < weekStart ? newDateWeekday + 7 : newDateWeekday) - weekStart
      const newDayOfMonth = newDate.date() + (6 - diff)
      newDate = newDate.date(newDayOfMonth)
      return newDate['$set'](C.HOUR, [23, 59, 59, 999])
    }
    return oldEndOf.call(this, units)
  }

  // Add IsoWeek related formatting tokens
  const additionalTokens: FormattingTokenDefinitions = {
    w: (sourceDate: EsDay) => sourceDate.week().toString(), // week 1..52
    ww: (sourceDate: EsDay) => padStart(sourceDate.week(), 2, '0'), // week 01..52
    wo: (sourceDate: EsDay) => toOrdinal(sourceDate, sourceDate.week()), // week 1st..52nd
    e: (sourceDate: EsDay) => sourceDate.weekday().toString(), // weekday 1..7
    gg: (sourceDate: EsDay) => padStart(sourceDate.weekYear(), 2, '0').slice(-2), // weekYear 70 .. 30
    gggg: (sourceDate: EsDay) => padStart(sourceDate.weekYear(), 4, '0'), // weekYear 1970 .. 2030
  }
  dayFactory.addFormatTokenDefinitions(additionalTokens)
}

export default weekPlugin
