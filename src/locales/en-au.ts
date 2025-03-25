/**
 * English (Australia) [en-AU]
 */

import localeEn from '~/locales/en'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeEnAu = cloneLocale(localeEn)

const formats = structuredClone(localeEnAu.formats)
formats.LT = 'h:mm A'
formats.LTS = 'h:mm:ss A'
formats.LLL = 'D MMMM YYYY h:mm A'
formats.LLLL = 'dddd, D MMMM YYYY h:mm A'
formats.lll = 'D MMMM YYYY h:mm A'
formats.llll = 'dddd, D MMMM YYYY h:mm A'

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeEnAu, 'name', 'en-AU')
setLocaleProperty(localeEnAu, 'weekStart', 0) // Sunday is the first day of the week.
setLocaleProperty(localeEnAu, 'formats', formats)

export default localeEnAu
