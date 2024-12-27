/**
 * English (Great Britain) [en-GB]
 */

import localeEn from '~/locales/en'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEnGb = cloneLocale(localeEn)

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEnGb, 'name', 'en-GB')

export default localeEnGb
