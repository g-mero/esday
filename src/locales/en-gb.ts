/**
 * English (United Kingdom) [en-GB]
 * This locale shows how to create a locale for a territory based
 * on the locale of the corresponding language.
 */

import localeEn from '~/locales/en'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEnGb = cloneLocale(localeEn)

const formats = {
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
}

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEnGb, 'name', 'en-GB')
setLocaleProperty(localeEnGb, 'weekStart', 1) // Monday is the first day of the week.
setLocaleProperty(localeEnGb, 'yearStart', 4) // The week that contains Jan 4th is the first week of the year.
setLocaleProperty(localeEnGb, 'formats', formats)

export default localeEnGb
