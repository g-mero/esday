import type {
  DayNames,
  DayNamesStandaloneFormat,
  Locale,
  MonthNames,
  MonthNamesStandaloneFormat,
} from '~/plugins/locale'

const dayNamesFormat: DayNames = [
  'воскресенье',
  'понедельник',
  'вторник',
  'среду',
  'четверг',
  'пятницу',
  'субботу',
]
const dayNamesStandalone: DayNames = [
  'воскресенье',
  'понедельник',
  'вторник',
  'среда',
  'четверг',
  'пятница',
  'суббота',
]
const weekdays: DayNamesStandaloneFormat = {
  standalone: dayNamesStandalone,
  format: dayNamesFormat,
  isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?] ?dddd/,
}

const monthFormat: MonthNames = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]
const monthStandalone: MonthNames = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
]
const months: MonthNamesStandaloneFormat = {
  standalone: monthStandalone,
  format: monthFormat,
}

const monthShortFormat: MonthNames = [
  'янв.',
  'февр.',
  'мар.',
  'апр.',
  'мая',
  'июня',
  'июля',
  'авг.',
  'сент.',
  'окт.',
  'нояб.',
  'дек.',
]
const monthShortStandalone: MonthNames = [
  'янв.',
  'февр.',
  'март',
  'апр.',
  'май',
  'июнь',
  'июль',
  'авг.',
  'сент.',
  'окт.',
  'нояб.',
  'дек.',
]
const monthsShort: MonthNamesStandaloneFormat = {
  standalone: monthShortStandalone,
  format: monthShortFormat,
}

function plural(timeStrings: string[], timeValue: number) {
  const forms = timeStrings
  return timeValue % 10 === 1 && timeValue % 100 !== 11
    ? forms[0]
    : timeValue % 10 >= 2 && timeValue % 10 <= 4 && (timeValue % 100 < 10 || timeValue % 100 >= 20)
      ? forms[1]
      : forms[2]
}
function relativeTimeWithPlural(
  timeValue: string | number,
  withoutSuffix: boolean,
  range: string,
): string {
  const format = {
    mm: withoutSuffix ? ['минута', 'минуты', 'минут'] : ['минуту', 'минуты', 'минут'],
    hh: ['час', 'часа', 'часов'],
    dd: ['день', 'дня', 'дней'],
    MM: ['месяц', 'месяца', 'месяцев'],
    yy: ['год', 'года', 'лет'],
  }
  if (range === 'm') {
    return withoutSuffix ? 'минута' : 'минуту'
  }

  return `${timeValue} ${plural(format[range as keyof typeof format], +timeValue)}`
}

const localeRu: Readonly<Locale> = {
  name: 'ru',
  weekdays,
  weekdaysShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
  weekdaysMin: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
  months,
  monthsShort,
  ordinal: (n) => `${n}`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY г.',
    LLL: 'D MMMM YYYY г., H:mm',
    LLLL: 'dddd, D MMMM YYYY г., H:mm',
    l: 'DD.MM.YYYY',
    ll: 'D MMMM YYYY г.',
    lll: 'D MMMM YYYY г., H:mm',
    llll: 'dddd, D MMMM YYYY г., H:mm',
  },
  relativeTime: {
    future: 'через %s',
    past: '%s назад',
    s: 'несколько секунд',
    ss: relativeTimeWithPlural,
    m: relativeTimeWithPlural,
    mm: relativeTimeWithPlural,
    h: 'час',
    hh: relativeTimeWithPlural,
    d: 'день',
    dd: relativeTimeWithPlural,
    M: 'месяц',
    MM: relativeTimeWithPlural,
    y: 'год',
    yy: relativeTimeWithPlural,
  },
  // eslint-disable-next-line  unused-imports/no-unused-vars
  meridiem: (hour: number, _minute: number, _isLowercase: boolean) => {
    if (hour < 4) {
      return 'ночи'
    }
    if (hour < 12) {
      return 'утра'
    }
    if (hour < 17) {
      return 'дня'
    }
    return 'вечера'
  },
}

export default localeRu
