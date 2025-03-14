/**
 * Talossan [tzl]
 */

import type { Locale } from '~/plugins/locale'

function relativeTimeFormatter(timeValue: string | number, withoutSuffix: boolean, range: string, isFuture: boolean): string {
  const format = {
    s: ['viensas secunds', '\'iensas secunds'],
    ss: [`${timeValue} secunds`, `${timeValue} secunds`],
    m: ['\'n míut', '\'iens míut'],
    mm: [`${timeValue} míuts`, `${timeValue} míuts`],
    h: ['\'n þora', '\'iensa þora'],
    hh: [`${timeValue} þoras`, `${timeValue} þoras`],
    d: ['\'n ziua', '\'iensa ziua'],
    dd: [`${timeValue} ziuas`, `${timeValue} ziuas`],
    M: ['\'n mes', '\'iens mes'],
    MM: [`${timeValue} mesen`, `${timeValue} mesen`],
    y: ['\'n ar', '\'iens ar'],
    yy: [`${timeValue} ars`, `${timeValue} ars`],
  }
  return isFuture
    ? format[range as keyof typeof format][0]
    : withoutSuffix
      ? format[range as keyof typeof format][0]
      : format[range as keyof typeof format][1]
}

const localeTzl: Readonly<Locale> = {
  name: 'tzl',
  weekdays: ['Súladi', 'Lúneçi', 'Maitzi', 'Márcuri', 'Xhúadi', 'Viénerçi', 'Sáturi'],
  weekdaysShort: ['Súl', 'Lún', 'Mai', 'Már', 'Xhú', 'Vié', 'Sát'],
  weekdaysMin: ['Sú', 'Lú', 'Ma', 'Má', 'Xh', 'Vi', 'Sá'],
  months: ['Januar', 'Fevraglh', 'Març', 'Avrïu', 'Mai', 'Gün', 'Julia', 'Guscht', 'Setemvar', 'Listopäts', 'Noemvar', 'Zecemvar'],
  monthsShort: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Gün', 'Jul', 'Gus', 'Set', 'Lis', 'Noe', 'Zec'],
  ordinal: n => `${n}.`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'HH.mm',
    LTS: 'HH.mm.ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM [dallas] YYYY',
    LLL: 'D. MMMM [dallas] YYYY HH.mm',
    LLLL: 'dddd, [li] D. MMMM [dallas] YYYY HH.mm',
    l: 'DD.MM.YYYY',
    ll: 'D. MMMM [dallas] YYYY',
    lll: 'D. MMMM [dallas] YYYY HH.mm',
    llll: 'dddd, [li] D. MMMM [dallas] YYYY HH.mm',
  },
  relativeTime: {
    future: 'osprei %s',
    past: 'ja%s',
    s: relativeTimeFormatter,
    ss: relativeTimeFormatter,
    m: relativeTimeFormatter,
    mm: relativeTimeFormatter,
    h: relativeTimeFormatter,
    hh: relativeTimeFormatter,
    d: relativeTimeFormatter,
    dd: relativeTimeFormatter,
    M: relativeTimeFormatter,
    MM: relativeTimeFormatter,
    y: relativeTimeFormatter,
    yy: relativeTimeFormatter,
  },
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    if (hour > 11) {
      return isLowercase ? 'd\'o' : 'D\'O'
    }
    else {
      return isLowercase ? 'd\'a' : 'D\'A'
    }
  },
}

export default localeTzl
