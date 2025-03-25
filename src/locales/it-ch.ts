/**
 * Italian (Switzerland) [it-CH]
 */

import localeIt from '~/locales/it'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeItCh = cloneLocale(localeIt)

const formats = structuredClone(localeItCh.formats)
formats.L = 'DD.MM.YYYY'
formats.l = 'DD.MM.YYYY'

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeItCh, 'name', 'it-CH')
setLocaleProperty(localeItCh, 'formats', formats)

export default localeItCh
