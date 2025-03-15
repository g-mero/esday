/**
 * French (Canada) [fr-CA]
 */

import localeFr from '~/locales/fr'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeFrCa = cloneLocale(localeFr)

const formats = structuredClone(localeFrCa.formats)
formats.L = 'YYYY-MM-DD'
formats.l = 'YYYY-MM-DD'

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeFrCa, 'name', 'fr-CA')
setLocaleProperty(localeFrCa, 'formats', formats)

export default localeFrCa
