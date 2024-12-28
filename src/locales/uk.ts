/**
 * Ukrainian [uk]
 */

import type { EsDay } from 'esday'
import type { Locale, MonthNames, MonthNamesFunction } from '~/plugins/locale'

const monthFormat: MonthNames = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня']
const monthStandalone: MonthNames = ['січень', 'лютий', 'березень', 'квітень', 'травень', 'червень', 'липень', 'серпень', 'вересень', 'жовтень', 'листопад', 'грудень']

const MONTHS_IN_FORMAT = /D[oD]?(?:\[[^[\]]*\]|\s)+MMMM?/

const months: MonthNamesFunction = (esdayInstance: EsDay, format: string) => {
  if (MONTHS_IN_FORMAT.test(format)) {
    return monthFormat[esdayInstance.month()]
  }
  return monthStandalone[esdayInstance.month()]
}
months.format = monthFormat
months.standalone = monthStandalone

function plural(timeStrings: string[], timeValue: number) {
  const forms = timeStrings
  return timeValue % 10 === 1 && timeValue % 100 !== 11 ? forms[0] : (timeValue % 10 >= 2 && timeValue % 10 <= 4 && (timeValue % 100 < 10 || timeValue % 100 >= 20) ? forms[1] : forms[2])
}
function relativeTimeWithPlural(timeValue: string | number, withoutSuffix: boolean, range: string): string {
  const format = {
    ss: withoutSuffix ? ['секунда', 'секунди', 'секунд'] : ['секунду', 'секунди', 'секунд'],
    mm: withoutSuffix ? ['хвилина', 'хвилини', 'хвилин'] : ['хвилину', 'хвилини', 'хвилин'],
    hh: withoutSuffix ? ['година', 'години', 'годин'] : ['годину', 'години', 'годин'],
    dd: ['день', 'дні', 'днів'],
    MM: ['місяць', 'місяці', 'місяців'],
    yy: ['рік', 'роки', 'років'],
  }
  if (range === 'm') {
    return withoutSuffix ? 'хвилина' : 'хвилину'
  }
  else if (range === 'h') {
    return withoutSuffix ? 'година' : 'годину'
  }

  return `${timeValue} ${plural(format[range as keyof typeof format], +timeValue)}`
}

const localeUk: Readonly<Locale> = {
  name: 'uk',
  weekdays: ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п’ятниця', 'субота'],
  weekdaysShort: ['ндл', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
  weekdaysMin: ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
  months,
  monthsShort: ['січ', 'лют', 'бер', 'квіт', 'трав', 'черв', 'лип', 'серп', 'вер', 'жовт', 'лист', 'груд'],
  weekStart: 1,
  yearStart: 4,
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY р.',
    LLL: 'D MMMM YYYY р., HH:mm',
    LLLL: 'dddd, D MMMM YYYY р., HH:mm',
    l: 'DD.MM.YYYY',
    ll: 'D MMMM YYYY р.',
    lll: 'D MMMM YYYY р., HH:mm',
    llll: 'dddd, D MMMM YYYY р., HH:mm',
  },
  relativeTime: {
    future: 'за %s',
    past: '%s тому',
    s: 'декілька секунд',
    m: relativeTimeWithPlural,
    mm: relativeTimeWithPlural,
    h: relativeTimeWithPlural,
    hh: relativeTimeWithPlural,
    d: 'день',
    dd: relativeTimeWithPlural,
    M: 'місяць',
    MM: relativeTimeWithPlural,
    y: 'рік',
    yy: relativeTimeWithPlural,
  },
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    const m = (hour < 12 ? 'AM' : 'PM')
    return isLowercase ? m.toLowerCase() : m
  },
  ordinal: n => `${n}`,
}

export default localeUk
