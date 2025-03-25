/**
 * Uyghur (China) [ug-CN]
 */

import type { Locale } from '~/plugins/locale'

const localeUgCn: Readonly<Locale> = {
  name: 'ug-CN',
  weekdays: ['يەكشەنبە', 'دۈشەنبە', 'سەيشەنبە', 'چارشەنبە', 'پەيشەنبە', 'جۈمە', 'شەنبە'],
  weekdaysShort: ['يە', 'دۈ', 'سە', 'چا', 'پە', 'جۈ', 'شە'],
  weekdaysMin: ['يە', 'دۈ', 'سە', 'چا', 'پە', 'جۈ', 'شە'],
  months: ['يانۋار', 'فېۋرال', 'مارت', 'ئاپرېل', 'ماي', 'ئىيۇن', 'ئىيۇل', 'ئاۋغۇست', 'سېنتەبىر', 'ئۆكتەبىر', 'نويابىر', 'دېكابىر'],
  monthsShort: ['يانۋار', 'فېۋرال', 'مارت', 'ئاپرېل', 'ماي', 'ئىيۇن', 'ئىيۇل', 'ئاۋغۇست', 'سېنتەبىر', 'ئۆكتەبىر', 'نويابىر', 'دېكابىر'],
  ordinal: n => `${n}`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 7, // The week that contains Jan 1st is the first week of the year.
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'YYYY-يىلىM-ئاينىڭD-كۈنى',
    LLL: 'YYYY-يىلىM-ئاينىڭD-كۈنى، HH:mm',
    LLLL: 'dddd، YYYY-يىلىM-ئاينىڭD-كۈنى، HH:mm',
    l: 'YYYY-MM-DD',
    ll: 'YYYY-يىلىM-ئاينىڭD-كۈنى',
    lll: 'YYYY-يىلىM-ئاينىڭD-كۈنى، HH:mm',
    llll: 'dddd، YYYY-يىلىM-ئاينىڭD-كۈنى، HH:mm',
  },
  relativeTime: {
    future: '%s كېيىن',
    past: '%s بۇرۇن',
    s: 'نەچچە سېكونت',
    ss: '%d سېكونت',
    m: 'بىر مىنۇت',
    mm: '%d مىنۇت',
    h: 'بىر سائەت',
    hh: '%d سائەت',
    d: 'بىر كۈن',
    dd: '%d كۈن',
    M: 'بىر ئاي',
    MM: '%d ئاي',
    y: 'بىر يىل',
    yy: '%d يىل',
  },
  // eslint-disable-next-line  unused-imports/no-unused-vars
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    const hm = hour * 100 + minute
    if (hm < 600) {
      return 'يېرىم كېچە'
    }
    else if (hm < 900) {
      return 'سەھەر'
    }
    else if (hm < 1130) {
      return 'چۈشتىن بۇرۇن'
    }
    else if (hm < 1230) {
      return 'چۈش'
    }
    else if (hm < 1800) {
      return 'چۈشتىن كېيىن'
    }
    else {
      return 'كەچ'
    }
  },
}

export default localeUgCn
