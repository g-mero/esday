/**
 * Uzbek [uz]
 */

import type { Locale } from '~/plugins/locale'

const localeUz: Readonly<Locale> = {
  name: 'uz',
  weekdays: ['Якшанба', 'Душанба', 'Сешанба', 'Чоршанба', 'Пайшанба', 'Жума', 'Шанба'],
  weekdaysShort: ['Якш', 'Душ', 'Сеш', 'Чор', 'Пай', 'Жум', 'Шан'],
  weekdaysMin: ['Як', 'Ду', 'Се', 'Чо', 'Па', 'Жу', 'Ша'],
  months: ['январ', 'феврал', 'март', 'апрел', 'май', 'июн', 'июл', 'август', 'сентябр', 'октябр', 'ноябр', 'декабр'],
  monthsShort: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  ordinal: n => `${n}`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 7, // The week that contains Jan 1st is the first week of the year.
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'D MMMM YYYY, dddd HH:mm',
    l: 'DD/MM/YYYY',
    ll: 'D MMMM YYYY',
    lll: 'D MMMM YYYY HH:mm',
    llll: 'D MMMM YYYY, dddd HH:mm',
  },
  relativeTime: {
    future: 'Якин %s ичида',
    past: '%s олдин',
    s: 'фурсат',
    ss: '%d фурсат',
    m: 'бир дакика',
    mm: '%d дакика',
    h: 'бир соат',
    hh: '%d соат',
    d: 'бир кун',
    dd: '%d кун',
    M: 'бир ой',
    MM: '%d ой',
    y: 'бир йил',
    yy: '%d йил',
  },
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    // Uzbek doesn't have AM/PM, so return default values
    const m = hour < 12 ? 'AM' : 'PM'
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localeUz
