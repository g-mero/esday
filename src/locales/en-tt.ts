/**
 * English (Trinidad & Tobago) [en-TT]
 */

import localeEn from '~/locales/en'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEnTt = cloneLocale(localeEn)

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEnTt, 'name', 'en-TT')

export default localeEnTt
