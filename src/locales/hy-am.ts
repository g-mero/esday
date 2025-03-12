/**
 * Armenian [hy-AM]
 */

import type { Locale } from '~/plugins/locale'

const localeHyAm: Readonly<Locale> = {
  name: 'hy-AM',
  weekdays: ['կիրակի', 'երկուշաբթի', 'երեքշաբթի', 'չորեքշաբթի', 'հինգշաբթի', 'ուրբաթ', 'շաբաթ'],
  weekdaysShort: ['կրկ', 'երկ', 'երք', 'չրք', 'հնգ', 'ուրբ', 'շբթ'],
  weekdaysMin: ['կրկ', 'երկ', 'երք', 'չրք', 'հնգ', 'ուրբ', 'շբթ'],
  months: ['հունվարի', 'փետրվարի', 'մարտի', 'ապրիլի', 'մայիսի', 'հունիսի', 'հուլիսի', 'օգոստոսի', 'սեպտեմբերի', 'հոկտեմբերի', 'նոյեմբերի', 'դեկտեմբերի'],
  monthsShort: ['հնվ', 'փտր', 'մրտ', 'ապր', 'մյս', 'հնս', 'հլս', 'օգս', 'սպտ', 'հկտ', 'նմբ', 'դկտ'],
  ordinal: n => `${n}`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 7, // The week that contains Jan 7th is the first week of the year.
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY թ.',
    LLL: 'D MMMM YYYY թ., HH:mm',
    LLLL: 'dddd, D MMMM YYYY թ., HH:mm',
    l: 'DD.MM.YYYY',
    ll: 'D MMMM YYYY թ.',
    lll: 'D MMMM YYYY թ., HH:mm',
    llll: 'dddd, D MMMM YYYY թ., HH:mm',
  },
  relativeTime: {
    future: '%s հետո',
    past: '%s առաջ',
    s: 'մի քանի վայրկյան',
    ss: '%d վայրկյան',
    m: 'րոպե',
    mm: '%d րոպե',
    h: 'ժամ',
    hh: '%d ժամ',
    d: 'օր',
    dd: '%d օր',
    M: 'ամիս',
    MM: '%d ամիս',
    y: 'տարի',
    yy: '%d տարի',
  },
  // eslint-disable-next-line  unused-imports/no-unused-vars
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    if (hour < 4) {
      return 'գիշերվա'
    }
    else if (hour < 12) {
      return 'առավոտվա'
    }
    else if (hour < 17) {
      return 'ցերեկվա'
    }
    else {
      return 'երեկոյան'
    }
  },
}

export default localeHyAm
