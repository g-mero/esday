/**
 * Chinese (China) [zh-CN]
 */

import localeZh from '~/locales/zh'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeZhCn = cloneLocale(localeZh)

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeZhCn, 'name', 'zh-CN')

export default localeZhCn
