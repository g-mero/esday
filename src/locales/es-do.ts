/**
 * Spanish (Dominican Republic) [es-DO]
 */

import localeEs from '~/locales/es'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEsDo = cloneLocale(localeEs)

const formats = {
  LT: 'h:mm A',
  LTS: 'h:mm:ss A',
  L: 'DD/MM/YYYY',
  LL: 'D [de] MMMM [de] YYYY',
  LLL: 'D [de] MMMM [de] YYYY h:mm A',
  LLLL: 'dddd, D [de] MMMM [de] YYYY h:mm A',
  l: 'DD/MM/YYYY',
  ll: 'D [de] MMMM [de] YYYY',
  lll: 'D [de] MMMM [de] YYYY h:mm A',
  llll: 'dddd, D [de] MMMM [de] YYYY h:mm A',
}

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEsDo, 'name', 'es-DO')
setLocaleProperty(localeEsDo, 'formats', formats)

export default localeEsDo
