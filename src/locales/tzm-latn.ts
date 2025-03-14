/**
 * Central Atlas Tamazight Latin [tzm-LATN]
 */

import localeTzm from '~/locales/tzm'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeTzmLatn = cloneLocale(localeTzm)

const weekdays = ['asamas', 'aynas', 'asinas', 'akras', 'akwas', 'asimwas', 'asiḍyas']
const months = ['innayr', 'brˤayrˤ', 'marˤsˤ', 'ibrir', 'mayyw', 'ywnyw', 'ywlywz', 'ɣwšt', 'šwtanbir', 'ktˤwbrˤ', 'nwwanbir', 'dwjnbir']
const relativeTime = {
  future: 'dadkh s yan %s',
  past: 'yan %s',
  s: 'imik',
  m: 'minuḍ',
  mm: '%d minuḍ',
  h: 'saɛa',
  hh: '%d tassaɛin',
  d: 'ass',
  dd: '%d ossan',
  M: 'ayowr',
  MM: '%d iyyirn',
  y: 'asgas',
  yy: '%d isgasn',
}

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeTzmLatn, 'name', 'tzm-LATN')
setLocaleProperty(localeTzmLatn, 'weekdays', weekdays)
setLocaleProperty(localeTzmLatn, 'weekdaysShort', weekdays)
setLocaleProperty(localeTzmLatn, 'weekdaysMin', weekdays)
setLocaleProperty(localeTzmLatn, 'months', months)
setLocaleProperty(localeTzmLatn, 'monthsShort', months)
setLocaleProperty(localeTzmLatn, 'relativeTime', relativeTime)

export default localeTzmLatn
