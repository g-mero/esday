/**
 * Hindi [hi]
 */

import type { Locale } from '~/plugins/locale'

const localeHi: Readonly<Locale> = {
  name: 'hi',
  weekdays: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरूवार', 'शुक्रवार', 'शनिवार'],
  weekdaysShort: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरू', 'शुक्र', 'शनि'],
  weekdaysMin: ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'],
  months: [
    'जनवरी',
    'फ़रवरी',
    'मार्च',
    'अप्रैल',
    'मई',
    'जून',
    'जुलाई',
    'अगस्त',
    'सितम्बर',
    'अक्टूबर',
    'नवम्बर',
    'दिसम्बर',
  ],
  monthsShort: [
    'जन.',
    'फ़र.',
    'मार्च',
    'अप्रै.',
    'मई',
    'जून',
    'जुल.',
    'अग.',
    'सित.',
    'अक्टू.',
    'नव.',
    'दिस.',
  ],
  ordinal: (n) => `${n}`,
  weekStart: 0, // Sunday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'A h:mm बजे',
    LTS: 'A h:mm:ss बजे',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY, A h:mm बजे',
    LLLL: 'dddd, D MMMM YYYY, A h:mm बजे',
    l: 'DD/MM/YYYY',
    ll: 'D MMMM YYYY',
    lll: 'D MMMM YYYY, A h:mm बजे',
    llll: 'dddd, D MMMM YYYY, A h:mm बजे',
  },
  relativeTime: {
    future: '%s में',
    past: '%s पहले',
    s: 'कुछ ही क्षण',
    ss: '%d सेकंड',
    m: 'एक मिनट',
    mm: '%d मिनट',
    h: 'एक घंटा',
    hh: '%d घंटे',
    d: 'एक दिन',
    dd: '%d दिन',
    M: 'एक महीने',
    MM: '%d महीने',
    y: 'एक वर्ष',
    yy: '%d वर्ष',
  },
  meridiem: (hour: number, _minute: number, isLowercase: boolean) => {
    // Hindi doesn't have AM/PM, so return default values
    const m = hour < 12 ? 'AM' : 'PM'
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localeHi
