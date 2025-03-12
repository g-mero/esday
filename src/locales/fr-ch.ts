/**
 * French (Switzerland) [fr-CH]
 */

import localeFr from '~/locales/fr'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeFrCh = cloneLocale(localeFr)

const formats = structuredClone(localeFrCh.formats)
formats.L = 'DD.MM.YYYY'
formats.l = 'DD.MM.YYYY'

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeFrCh, 'name', 'fr-CH')
setLocaleProperty(localeFrCh, 'formats', formats)

export default localeFrCh
