/**
 * Uzbek Latin [uz-LATN]
 */

import localeUz from '~/locales/uz'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeUzLatn = cloneLocale(localeUz)

const weekdays = ['asamas', 'aynas', 'asinas', 'akras', 'akwas', 'asimwas', 'asiḍyas']
const months = ['innayr', 'brˤayrˤ', 'marˤsˤ', 'ibrir', 'mayyw', 'ywnyw', 'ywlywz', 'ɣwšt', 'šwtanbir', 'ktˤwbrˤ', 'nwwanbir', 'dwjnbir']
const relativeTime = {
  future: 'Yaqin %s ichida',
  past: 'Bir necha %s oldin',
  s: 'soniya',
  ss: '%d soniya',
  m: 'bir daqiqa',
  mm: '%d daqiqa',
  h: 'bir soat',
  hh: '%d soat',
  d: 'bir kun',
  dd: '%d kun',
  M: 'bir oy',
  MM: '%d oy',
  y: 'bir yil',
  yy: '%d yil',
}

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeUzLatn, 'name', 'uz-LATN')
setLocaleProperty(localeUzLatn, 'weekdays', weekdays)
setLocaleProperty(localeUzLatn, 'weekdaysShort', weekdays)
setLocaleProperty(localeUzLatn, 'weekdaysMin', weekdays)
setLocaleProperty(localeUzLatn, 'months', months)
setLocaleProperty(localeUzLatn, 'monthsShort', months)
setLocaleProperty(localeUzLatn, 'relativeTime', relativeTime)

export default localeUzLatn
