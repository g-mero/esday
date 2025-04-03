/**
 * English (New Zealand) [en-NZ]
 */

import localeEn from '~/locales/en'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEnNz = cloneLocale(localeEn)

const formats = {
  LT: 'h:mm A',
  LTS: 'h:mm:ss A',
  L: 'DD/MM/YYYY',
  LL: 'D MMMM YYYY',
  LLL: 'D MMMM YYYY h:mm A',
  LLLL: 'dddd, D MMMM YYYY h:mm A',
  l: 'DD/MM/YYYY',
  ll: 'D MMMM YYYY',
  lll: 'D MMMM YYYY h:mm A',
  llll: 'dddd, D MMMM YYYY h:mm A',
}

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEnNz, 'name', 'en-NZ')
setLocaleProperty(localeEnNz, 'weekStart', 1) // Monday is the first day of the week.
setLocaleProperty(localeEnNz, 'yearStart', 4) // The week that contains Jan 4th is the first week of the year.
setLocaleProperty(localeEnNz, 'formats', formats)

export default localeEnNz
