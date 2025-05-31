/**
 * Arabic [ar]
 */

import type { Locale } from '~/plugins/locale'

// used in preParse function (number symbol => number)
const arabicToEnglishNumbersMap = {
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
  '٠': '0',
}

// used in postFormat function (number => number symbol)
const englishToArabicNumbersMap = {
  1: '١',
  2: '٢',
  3: '٣',
  4: '٤',
  5: '٥',
  6: '٦',
  7: '٧',
  8: '٨',
  9: '٩',
  0: '٠',
}

const locale: Readonly<Locale> = {
  name: 'ar',
  weekdays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  weekdaysShort: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
  weekdaysMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  months: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
  monthsShort: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
  ordinal: (n) => `${n}`,
  weekStart: 6, // Saturday is the first day of the week.
  yearStart: 1, // The week that contains Jan 1st is the first week of the year.
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'D/\u200FM/\u200FYYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm',
    l: 'D/\u200FM/\u200FYYYY',
    ll: 'D MMMM YYYY',
    lll: 'D MMMM YYYY HH:mm',
    llll: 'dddd D MMMM YYYY HH:mm',
  },
  calendar: {
    sameDay: '[اليوم عند الساعة] LT',
    nextDay: '[غدًا عند الساعة] LT',
    nextWeek: 'dddd [عند الساعة] LT',
    lastDay: '[أمس عند الساعة] LT',
    lastWeek: 'dddd [عند الساعة] LT',
    sameElse: 'L',
  },
  relativeTime: {
    future: 'بعد %s',
    past: 'منذ %s',
    s: 'ثانية واحدة',
    ss: '%d ثانية',
    m: 'دقيقة واحدة',
    mm: '%d دقائق',
    h: 'ساعة واحدة',
    hh: '%d ساعات',
    d: 'يوم واحد',
    dd: '%d أيام',
    M: 'شهر واحد',
    MM: '%d أشهر',
    y: 'عام واحد',
    yy: '%d أعوام',
  },
  // eslint-disable-next-line  unused-imports/no-unused-vars
  meridiem: (hour: number, _minute: number, _isLowercase: boolean) => (hour > 12 ? 'م' : 'ص'),
  preParse: (dateString: string) =>
    dateString
      .replace(
        /[١٢٣٤٥٦٧٨٩٠]/g,
        (match) => arabicToEnglishNumbersMap[match as keyof typeof arabicToEnglishNumbersMap],
      )
      .replace(/،/g, ','),
  postFormat: (formattedDate: string) =>
    formattedDate
      .replace(
        /\d/g,
        (match) =>
          englishToArabicNumbersMap[Number(match) as keyof typeof englishToArabicNumbersMap],
      )
      .replace(/,/g, '،'),
}

export default locale
