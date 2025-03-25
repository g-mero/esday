/**
 * Spanish (Mexico) [es-MX]
 */

import localeEs from '~/locales/es'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEsMx = cloneLocale(localeEs)

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEsMx, 'name', 'es-MX')
setLocaleProperty(localeEsMx, 'weekStart', 0) // Sunday is the first day of the week.

export default localeEsMx
