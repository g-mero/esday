/**
 * Spanish (United States) [es-US]
 */

import localeEs from '~/locales/es'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEsUs = cloneLocale(localeEs)

const formats = {
  LT: 'h:mm A',
  LTS: 'h:mm:ss A',
  L: 'MM/DD/YYYY',
  LL: 'D [de] MMMM [de] YYYY',
  LLL: 'D [de] MMMM [de] YYYY h:mm A',
  LLLL: 'dddd, D [de] MMMM [de] YYYY h:mm A',
  l: 'MM/DD/YYYY',
  ll: 'D [de] MMMM [de] YYYY',
  lll: 'D [de] MMMM [de] YYYY h:mm A',
  llll: 'dddd, D [de] MMMM [de] YYYY h:mm A',
}

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEsUs, 'name', 'es-US')
setLocaleProperty(localeEsUs, 'weekStart', 0) // Sunday is the first day of the week.
setLocaleProperty(localeEsUs, 'yearStart', 6) // The week that contains Jan 1st is the first week of the year.
setLocaleProperty(localeEsUs, 'formats', formats)

export default localeEsUs
