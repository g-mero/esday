/**
 * Chinese (Hong Kong) [zh-HK]
 */

import localeZh from '~/locales/zh'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeZhHk = cloneLocale(localeZh)

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeZhHk, 'name', 'zh-HK')

export default localeZhHk
