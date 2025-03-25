/**
 * Pseudo [x-pseudo]
 */

import type { Locale } from '~/plugins/locale'

const localeXpseudo: Readonly<Locale> = {
  name: 'x-pseudo',
  weekdays: ['S~úñdá~ý', 'Mó~ñdáý~', 'Túé~sdáý~', 'Wéd~ñésd~áý', 'T~húrs~dáý', '~Fríd~áý', 'S~átúr~dáý'],
  weekdaysShort: ['S~úñ', '~Móñ', '~Túé', '~Wéd', '~Thú', '~Frí', '~Sát'],
  weekdaysMin: ['S~ú', 'Mó~', 'Tú', '~Wé', 'T~h', 'Fr~', 'Sá'],
  months: ['J~áñúá~rý', 'F~ébrú~árý', '~Márc~h', 'Áp~ríl', '~Máý', '~Júñé~', 'Júl~ý', 'Áú~gúst~', 'Sép~témb~ér', 'Ó~ctób~ér', 'Ñ~óvém~bér', '~Décé~mbér'],
  monthsShort: ['J~áñ', '~Féb', '~Már', '~Ápr', '~Máý', '~Júñ', '~Júl', '~Áúg', '~Sép', '~Óct', '~Ñóv', '~Déc'],
  ordinal: (n: number) => {
    const one = n % 10
    const output
      = ~~((n % 100) / 10) === 1
        ? 'th'
        : one === 1
          ? 'st'
          : one === 2
            ? 'nd'
            : one === 3
              ? 'rd'
              : 'th'
    return `${n}${output}`
  },
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm',
    l: 'DD/MM/YYYY',
    ll: 'D MMMM YYYY',
    lll: 'D MMMM YYYY HH:mm',
    llll: 'dddd, D MMMM YYYY HH:mm',
  },
  relativeTime: {
    future: 'í~ñ %s',
    past: '%s á~gó',
    s: 'á ~féw ~sécó~ñds',
    ss: '%d s~écóñ~ds',
    m: 'á ~míñ~úté',
    mm: '%d m~íñú~tés',
    h: 'á~ñ hó~úr',
    hh: '%d h~óúrs',
    d: 'á ~dáý',
    dd: '%d d~áýs',
    M: 'á ~móñ~th',
    MM: '%d m~óñt~hs',
    y: 'á ~ýéár',
    yy: '%d ý~éárs',
  },
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    // Pseudo doesn't have AM/PM, so return default values
    const m = hour < 12 ? 'AM' : 'PM'
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localeXpseudo
