/**
 * Arabic (Kuwait) [ar-KW]
 */

import localeAr from '~/locales/ar'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeArKw = cloneLocale(localeAr)
const formats = structuredClone(localeArKw.formats)
formats.L = 'DD/MM/YYYY'
formats.l = 'DD/MM/YYYY'

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeArKw, 'name', 'ar-KW')
setLocaleProperty(localeArKw, 'weekStart', 0) // Sunday is the first day of the week.
setLocaleProperty(localeArKw, 'formats', formats)

export default localeArKw
