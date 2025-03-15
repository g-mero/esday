/**
 * Arabic (Saudi Arabia) [ar-SA]
 */

import localeAr from '~/locales/ar'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeArSa = cloneLocale(localeAr)

const formats = structuredClone(localeArSa.formats)
formats.L = 'DD/MM/YYYY'
formats.l = 'DD/MM/YYYY'

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeArSa, 'name', 'ar-SA')
setLocaleProperty(localeArSa, 'weekStart', 0) // Sunday is the first day of the week.
setLocaleProperty(localeArSa, 'yearStart', 6) // The week that contains Jan 6th is the first week of the year.
setLocaleProperty(localeArSa, 'formats', formats)

export default localeArSa
