/**
 * Spanish (United States) [es-US]
 */

import localeEs from '~/locales/es'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEsUs = cloneLocale(localeEs)

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEsUs, 'name', 'es-US')

export default localeEsUs
