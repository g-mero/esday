/**
 * Spanish [es]
 */

import type { Locale } from '~/plugins/locale'

const localeEs: Readonly<Locale> = {
  name: 'es',
  weekdays: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  weekdaysShort: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  weekdaysMin: ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sá'],
  months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  monthsShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  weekStart: 1,
  yearStart: 4,
  formats: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D [de] MMMM [de] YYYY',
    LLL: 'D [de] MMMM [de] YYYY H:mm',
    LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm',
    l: 'DD/MM/YYYY',
    ll: 'D [de] MMMM [de] YYYY',
    lll: 'D [de] MMMM [de] YYYY H:mm',
    llll: 'dddd, D [de] MMMM [de] YYYY H:mm',
  },
  relativeTime: {
    future: 'en %s',
    past: 'hace %s',
    s: 'unos segundos',
    m: 'un minuto',
    mm: '%d minutos',
    h: 'una hora',
    hh: '%d horas',
    d: 'un día',
    dd: '%d días',
    M: 'un mes',
    MM: '%d meses',
    y: 'un año',
    yy: '%d años',
  },
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    const m = (hour < 12 ? 'AM' : 'PM')
    return isLowercase ? m.toLowerCase() : m
  },
  ordinal: n => `${n}º`,
}

export default localeEs
