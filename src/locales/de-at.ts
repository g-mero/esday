/**
 * German (Austria) [de-AT]
 */

import localeDe from '~/locales/de'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeDeAt = cloneLocale(localeDe)

const months = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
const monthsShort = ['Jän.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.']

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeDeAt, 'name', 'de-AT')
setLocaleProperty(localeDeAt, 'months', months)
setLocaleProperty(localeDeAt, 'monthsShort', monthsShort)

export default localeDeAt
