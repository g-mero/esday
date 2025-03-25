/**
 * English (Ireland) [en-IE]
 */

import localeEn from '~/locales/en'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEnIe = cloneLocale(localeEn)

const formats = structuredClone(localeEnIe.formats)
formats.LLLL = 'dddd D MMMM YYYY HH:mm'
formats.llll = 'dddd D MMMM YYYY HH:mm'

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEnIe, 'name', 'en-IE')
setLocaleProperty(localeEnIe, 'formats', formats)

export default localeEnIe
