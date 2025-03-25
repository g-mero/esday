/**
 * Spanish (Puerto Rico) [es-PR]
 */

import localeEs from '~/locales/es'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEsPr = cloneLocale(localeEs)

const formats = structuredClone(localeEsPr.formats)
formats.L = 'DD/MM/YYYY'
formats.l = 'DD/MM/YYYY'

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEsPr, 'name', 'es-PR')
setLocaleProperty(localeEsPr, 'formats', formats)

export default localeEsPr
