/*
 * Mongolian [mn]
 */
import type { Locale } from '~/plugins/locale'

const localeMn: Readonly<Locale> = {
  name: 'mn',
  weekdays: ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'],
  weekdaysShort: ['Ням', 'Дав', 'Мяг', 'Лха', 'Пүр', 'Баа', 'Бям'],
  weekdaysMin: ['Ня', 'Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя'],
  months: [
    'Нэгдүгээр сар',
    'Хоёрдугаар сар',
    'Гуравдугаар сар',
    'Дөрөвдүгээр сар',
    'Тавдугаар сар',
    'Зургадугаар сар',
    'Долдугаар сар',
    'Наймдугаар сар',
    'Есдүгээр сар',
    'Аравдугаар сар',
    'Арван нэгдүгээр сар',
    'Арван хоёрдугаар сар',
  ],
  monthsShort: [
    '1 сар',
    '2 сар',
    '3 сар',
    '4 сар',
    '5 сар',
    '6 сар',
    '7 сар',
    '8 сар',
    '9 сар',
    '10 сар',
    '11 сар',
    '12 сар',
  ],
  ordinal: (n) => `${n}`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'YYYY оны MMMMын D',
    LLL: 'YYYY оны MMMMын D HH:mm',
    LLLL: 'dddd, YYYY оны MMMMын D HH:mm',
    l: 'YYYY-MM-DD',
    ll: 'YYYY оны MMMMын D',
    lll: 'YYYY оны MMMMын D HH:mm',
    llll: 'dddd, YYYY оны MMMMын D HH:mm',
  },
  calendar: {
    sameDay: '[Өнөөдөр] LT',
    nextDay: '[Маргааш] LT',
    nextWeek: '[Ирэх] dddd LT',
    lastDay: '[Өчигдөр] LT',
    lastWeek: '[Өнгөрсөн] dddd LT',
    sameElse: 'L',
  },
  relativeTime: {
    future: '%s',
    past: '%s',
    s: 'саяхан',
    ss: '%d секунд',
    m: 'м',
    mm: '%d м',
    h: '1 ц',
    hh: '%d ц',
    d: '1 ө',
    dd: '%d ө',
    M: '1 с',
    MM: '%d с',
    y: '1 ж',
    yy: '%d ж',
  },
  // eslint-disable-next-line  unused-imports/no-unused-vars
  meridiem: (hour: number, _minute: number, _isLowercase: boolean) => {
    if (hour < 12) {
      return 'ҮӨ'
    }
    return 'ҮХ'
  },
}

export default localeMn
