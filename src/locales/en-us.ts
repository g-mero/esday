/**
 * English (United States) [en-US]
 */

import localeEn from '~/locales/en'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEnUs = cloneLocale(localeEn)

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEnUs, 'name', 'en-US')

export default localeEnUs
