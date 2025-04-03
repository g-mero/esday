/**
 * German (Switzerland) [de-CH]
 */

import localeDe from '~/locales/de'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeDeCh = cloneLocale(localeDe)

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeDeCh, 'name', 'de-CH')

export default localeDeCh
