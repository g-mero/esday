/**
 * Arabic (Algeria) [ar-DZ]
 */

import localeAr from '~/locales/ar'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeArDz = cloneLocale(localeAr)

const months = ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeArDz, 'name', 'ar-DZ')
setLocaleProperty(localeArDz, 'months', months)
setLocaleProperty(localeArDz, 'monthsShort', months)
setLocaleProperty(localeArDz, 'weekStart', 0) // Sunday is the first day of the week.
setLocaleProperty(localeArDz, 'yearStart', 4) // The week that contains Jan 4th is the first week of the year.

export default localeArDz
