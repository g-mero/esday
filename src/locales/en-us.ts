/**
 * English (United States) [en-US]
 * This locale shows how to create a locale for a territory based
 * on the locale of the corresponding language.
 */

import localeEn from '~/locales/en'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEnUs = cloneLocale(localeEn)
const localeEnUsFormats = {
  LT: 'h:mm a',
  LTS: 'h:mm:ss a',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm a',
  LLLL: 'dddd, MMMM D, YYYY h:mm a',
  l: 'MM/DD/YYYY',
  ll: 'MMMM D, YYYY',
  lll: 'MMMM D, YYYY h:mm a',
  llll: 'dddd, MMMM D, YYYY h:mm a',

}

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEnUs, 'name', 'en-US')
setLocaleProperty(localeEnUs, 'weekStart', 0)
setLocaleProperty(localeEnUs, 'yearStart', 1)
setLocaleProperty(localeEnUs, 'key', localeEnUsFormats)

export default localeEnUs
