/**
 * Dutch (Belgium) [nl-BE]
 */

import localeNl from '~/locales/nl'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeNlBe = cloneLocale(localeNl)

const formats = structuredClone(localeNlBe.formats)
formats.L = 'DD/MM/YYYY'
formats.l = 'DD/MM/YYYY'

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeNlBe, 'name', 'nl-BE')
setLocaleProperty(localeNlBe, 'formats', formats)

export default localeNlBe
