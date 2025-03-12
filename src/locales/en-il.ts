/**
 * English (Israel) [en-IL]
 */

import localeEn from '~/locales/en'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEnIl = cloneLocale(localeEn)

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEnIl, 'name', 'en-IL')

export default localeEnIl
