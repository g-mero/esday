/**
 * English (Ireland) [en-IE]
 */

import localeEn from '~/locales/en'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEnIe = cloneLocale(localeEn)

const formats = {
  LT: 'HH:mm',
  LTS: 'HH:mm:ss',
  L: 'DD/MM/YYYY',
  LL: 'D MMMM YYYY',
  LLL: 'D MMMM YYYY HH:mm',
  LLLL: 'dddd D MMMM YYYY HH:mm',
  l: 'DD/MM/YYYY',
  ll: 'D MMMM YYYY',
  lll: 'D MMMM YYYY HH:mm',
  llll: 'dddd D MMMM YYYY HH:mm',
}

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEnIe, 'name', 'en-IE')
setLocaleProperty(localeEnIe, 'formats', formats)

export default localeEnIe
