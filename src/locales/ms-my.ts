/**
 * Malay [ms-MY]
 */

import localeMs from '~/locales/ms'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeMsMy = cloneLocale(localeMs)

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeMsMy, 'name', 'ms-MY')

export default localeMsMy
