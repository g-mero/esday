/**
 * Icelandic [is]
 */

import type { Locale } from '~/plugins/locale'

const relativeTimeFormatStrings = {
  s: ['nokkrar sekúndur', 'nokkrar sekúndur', 'nokkrum sekúndum'],
  ss: ['sekúndur', 'sekúndur', 'sekúndum'],
  m: ['mínúta', 'mínútu', 'mínútu'],
  mm: ['mínútur', 'mínútur', 'mínútum'],
  h: ['klukkustund', 'klukkustund', 'klukkustund'],
  hh: ['klukkustundir', 'klukkustundir', 'klukkustundum'],
  d: ['dagur', 'dag', 'degi'],
  dd: ['dagar', 'daga', 'dögum'],
  M: ['mánuður', 'mánuð', 'mánuði'],
  MM: ['mánuðir', 'mánuði', 'mánuðum'],
  y: ['ár', 'ár', 'ári'],
  yy: ['ár', 'ár', 'árum'],
}

function resolveTemplate(
  key: string,
  number: number,
  isFuture: boolean,
  withoutSuffix: boolean,
): string {
  const suffixIndex = isFuture ? 1 : 2
  const index = withoutSuffix ? 0 : suffixIndex
  const keyShouldBeSingular = key.length === 2 && number % 10 === 1
  const correctedKey = keyShouldBeSingular ? key[0] : key
  const unitText = relativeTimeFormatStrings[correctedKey as keyof typeof relativeTimeFormatStrings]
  const text = unitText[index]
  return key.length === 1 ? text : `%d ${text}`
}

function relativeTimeFormatter(
  timeValue: string | number,
  withoutSuffix: boolean,
  range: string,
  isFuture: boolean,
): string {
  const template = resolveTemplate(range, +timeValue, isFuture, withoutSuffix)

  return template.replace('%d', String(timeValue))
}

const localeIs: Readonly<Locale> = {
  name: 'is',
  weekdays: [
    'sunnudagur',
    'mánudagur',
    'þriðjudagur',
    'miðvikudagur',
    'fimmtudagur',
    'föstudagur',
    'laugardagur',
  ],
  weekdaysShort: ['sun', 'mán', 'þri', 'mið', 'fim', 'fös', 'lau'],
  weekdaysMin: ['Su', 'Má', 'Þr', 'Mi', 'Fi', 'Fö', 'La'],
  months: [
    'janúar',
    'febrúar',
    'mars',
    'apríl',
    'maí',
    'júní',
    'júlí',
    'ágúst',
    'september',
    'október',
    'nóvember',
    'desember',
  ],
  monthsShort: ['jan', 'feb', 'mar', 'apr', 'maí', 'jún', 'júl', 'ágú', 'sep', 'okt', 'nóv', 'des'],
  ordinal: (n) => `${n}`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY [kl.] H:mm',
    LLLL: 'dddd, D. MMMM YYYY [kl.] H:mm',
    l: 'DD.MM.YYYY',
    ll: 'D. MMMM YYYY',
    lll: 'D. MMMM YYYY [kl.] H:mm',
    llll: 'dddd, D. MMMM YYYY [kl.] H:mm',
  },
  relativeTime: {
    future: 'eftir %s',
    past: 'fyrir %s síðan',
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
  meridiem: (hour: number, _minute: number, isLowercase: boolean) => {
    // Icelandic doesn't have AM/PM, so return default values
    const m = hour < 12 ? 'AM' : 'PM'
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localeIs
