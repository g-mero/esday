/**
 * Chinese (Taiwan) [zh-TW]
 */

import localeZh from '~/locales/zh'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeZhTw = cloneLocale(localeZh)

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeZhTw, 'name', 'zh-TW')

export default localeZhTw
