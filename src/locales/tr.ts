/**
 * Turkish [tr]
 */

import type { Locale } from '~/plugins/locale'

const suffixes = {
  1: '\'inci',
  5: '\'inci',
  8: '\'inci',
  70: '\'inci',
  80: '\'inci',
  2: '\'nci',
  7: '\'nci',
  20: '\'nci',
  50: '\'nci',
  3: '\'üncü',
  4: '\'üncü',
  100: '\'üncü',
  6: '\'ncı',
  9: '\'uncu',
  10: '\'uncu',
  30: '\'uncu',
  60: '\'ıncı',
  90: '\'ıncı',
}

const localeTr: Readonly<Locale> = {
  name: 'tr',
  weekdays: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  weekdaysShort: ['Paz', 'Pts', 'Sal', 'Çar', 'Per', 'Cum', 'Cts'],
  weekdaysMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
  months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  monthsShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  ordinal: (n: number) => {
    if (n === 0) {
      // special case for zero
      return `${n}''ıncı`
    }
    const a = n % 10
    const b = (n % 100) - a
    const c = n >= 100 ? 100 : null
    const suffix = (
      suffixes[a as keyof typeof suffixes]
      || suffixes[b as keyof typeof suffixes]
      || suffixes[c as keyof typeof suffixes]
    )
    return `${n}${suffix}`
  },
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 7, // The week that contains Jan 7th is the first week of the year.
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm',
    l: 'DD.MM.YYYY',
    ll: 'D MMMM YYYY',
    lll: 'D MMMM YYYY HH:mm',
    llll: 'dddd, D MMMM YYYY HH:mm',
  },
  relativeTime: {
    future: '%s sonra',
    past: '%s önce',
    s: 'birkaç saniye',
    ss: '%d saniye',
    m: 'bir dakika',
    mm: '%d dakika',
    h: 'bir saat',
    hh: '%d saat',
    d: 'bir gün',
    dd: '%d gün',
    M: 'bir ay',
    MM: '%d ay',
    y: 'bir yıl',
    yy: '%d yıl',
  },
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    if (hour < 12) {
      return isLowercase ? 'öö' : 'ÖÖ'
    }
    else {
      return isLowercase ? 'ös' : 'ÖS'
    }
  },
}

export default localeTr
