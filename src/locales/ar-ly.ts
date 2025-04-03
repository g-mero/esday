/**
 * Arabic (Lybia) [ar-LY]
 */

import localeAr from '~/locales/ar'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeArLy = cloneLocale(localeAr)

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeArLy, 'name', 'ar-LY')

export default localeArLy
