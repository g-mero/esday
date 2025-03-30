/**
 * Tajik [tg]
 */

import type { Locale } from '~/plugins/locale'

const localeTg: Readonly<Locale> = {
  name: 'tg',
  weekdays: ['якшанбе', 'душанбе', 'сешанбе', 'чоршанбе', 'панҷшанбе', 'ҷумъа', 'шанбе'],
  weekdaysShort: ['яшб', 'дшб', 'сшб', 'чшб', 'пшб', 'ҷум', 'шнб'],
  weekdaysMin: ['яш', 'дш', 'сш', 'чш', 'пш', 'ҷм', 'шб'],
  months: [
    'январ',
    'феврал',
    'март',
    'апрел',
    'май',
    'июн',
    'июл',
    'август',
    'сентябр',
    'октябр',
    'ноябр',
    'декабр',
  ],
  monthsShort: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  ordinal: (n) => `${n}`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 1, // The week that contains Jan 1st is the first week of the year.
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm',
    l: 'DD/MM/YYYY',
    ll: 'D MMMM YYYY',
    lll: 'D MMMM YYYY HH:mm',
    llll: 'dddd, D MMMM YYYY HH:mm',
  },
  relativeTime: {
    future: 'баъди %s',
    past: '%s пеш',
    s: 'якчанд сония',
    ss: '%d сония',
    m: 'як дақиқа',
    mm: '%d дақиқа',
    h: 'як соат',
    hh: '%d соат',
    d: 'як рӯз',
    dd: '%d рӯз',
    M: 'як моҳ',
    MM: '%d моҳ',
    y: 'як сол',
    yy: '%d сол',
  },
  // eslint-disable-next-line unused-imports/no-unused-vars
  meridiem: (hour: number, _minute: number, _isLowercase: boolean) => {
    if (hour < 4) {
      return 'шаб'
    }
    if (hour < 11) {
      return 'субҳ'
    }
    if (hour < 16) {
      return 'рӯз'
    }
    if (hour < 19) {
      return 'бегоҳ'
    }
    return 'шаб'
  },
}

export default localeTg
