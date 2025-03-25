/**
 * English (Singapore) [en-SG]
 */

import localeEn from '~/locales/en'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEnSg = cloneLocale(localeEn)

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEnSg, 'name', 'en-SG')

export default localeEnSg
