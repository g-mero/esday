/**
 * English (Canada) [en-CA]
 */

import localeEn from '~/locales/en'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEnCa = cloneLocale(localeEn)

const formats = {
  LT: 'h:mm A',
  LTS: 'h:mm:ss A',
  L: 'YYYY-MM-DD',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm A',
  LLLL: 'dddd, MMMM D, YYYY h:mm A',
  l: 'YYYY-MM-DD',
  ll: 'MMMM D, YYYY',
  lll: 'MMMM D, YYYY h:mm A',
  llll: 'dddd, MMMM D, YYYY h:mm A',
}

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEnCa, 'name', 'en-CA')
setLocaleProperty(localeEnCa, 'weekStart', 0) // Sunday is the first day of the week.
setLocaleProperty(localeEnCa, 'formats', formats)

export default localeEnCa
