/**
 * Arabic (Iraq) [ar-IQ]
 */

import localeAr from '~/locales/ar'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeArIq = cloneLocale(localeAr)

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeArIq, 'name', 'ar-IQ')

export default localeArIq
