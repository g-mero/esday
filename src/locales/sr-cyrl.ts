/**
 * Serbian Cyrillic [sr-CYRL]
 */

import localeSr from '~/locales/sr'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeSrCyrl = cloneLocale(localeSr)

const weekdays = ['Недеља', 'Понедељак', 'Уторак', 'Среда', 'Четвртак', 'Петак', 'Субота']
const weekdaysShort = ['Нед.', 'Пон.', 'Уто.', 'Сре.', 'Чет.', 'Пет.', 'Суб.']
const weekdaysMin = ['не', 'по', 'ут', 'ср', 'че', 'пе', 'су']
const months = [
  'Јануар',
  'Фебруар',
  'Март',
  'Април',
  'Мај',
  'Јун',
  'Јул',
  'Август',
  'Септембар',
  'Октобар',
  'Новембар',
  'Децембар',
]
const monthsShort = [
  'Јан.',
  'Феб.',
  'Мар.',
  'Апр.',
  'Мај',
  'Јун',
  'Јул',
  'Авг.',
  'Сеп.',
  'Окт.',
  'Нов.',
  'Дец.',
]

function plural(timeValue: number, wordKey: string[]) {
  if (
    timeValue % 10 >= 1 &&
    timeValue % 10 <= 4 &&
    (timeValue % 100 < 10 || timeValue % 100 >= 20)
  ) {
    return timeValue % 10 === 1 ? wordKey[0] : wordKey[1]
  }
  return wordKey[2]
}
function relativeTimeFormatter(
  timeValue: string | number,
  withoutSuffix: boolean,
  range: string,
  isFuture: boolean,
): string {
  const formats = {
    ss: ['секунда', 'секунде', 'секунди'],
    m: ['један минут', 'једног минута'],
    mm: ['%d минут', '%d минута', '%d минута'],
    h: ['један сат', 'једног сата'],
    hh: ['%d сат', '%d сата', '%d сати'],
    d: ['један дан', 'једног дана'],
    dd: ['%d дан', '%d дана', '%d дана'],
    M: ['један месец', 'једног месеца'],
    MM: ['%d месец', '%d месеца', '%d месеци'],
    y: ['једну годину', 'једне године'],
    yy: ['%d годину', '%d године', '%d година'],
  }

  const wordKey = formats[range as keyof typeof formats]

  if (range.length === 1) {
    // Nominativ
    if (range === 'y' && withoutSuffix) return 'једна година'
    return isFuture || withoutSuffix ? wordKey[0] : wordKey[1]
  }

  const word = plural(+timeValue, wordKey)
  // Nominativ
  if (range === 'yy' && withoutSuffix && word === '%d годину') return `${timeValue} година`

  return word.replace('%d', timeValue.toString())
}
const relativeTime = {
  future: 'за %s',
  past: 'пре %s',
  s: 'неколико секунди',
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
}

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeSrCyrl, 'name', 'sr-CYRL')
setLocaleProperty(localeSrCyrl, 'weekdays', weekdays)
setLocaleProperty(localeSrCyrl, 'weekdaysShort', weekdaysShort)
setLocaleProperty(localeSrCyrl, 'weekdaysMin', weekdaysMin)
setLocaleProperty(localeSrCyrl, 'months', months)
setLocaleProperty(localeSrCyrl, 'monthsShort', monthsShort)
setLocaleProperty(localeSrCyrl, 'relativeTime', relativeTime)

export default localeSrCyrl
