/**
 * Bengali (Bangladesh) [bn-BD]
 */

import localeBn from '~/locales/bn'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeBnBd = cloneLocale(localeBn)

// eslint-disable-next-line  unused-imports/no-unused-vars
function meridiem(hour: number, _minute: number, _isLowercase: boolean) {
  if (hour < 4) {
    return 'রাত'
  }
  if (hour < 6) {
    return 'ভোর'
  }
  if (hour < 12) {
    return 'সকাল'
  }
  if (hour < 15) {
    return 'দুপুর'
  }
  if (hour < 18) {
    return 'বিকাল'
  }
  if (hour < 20) {
    return 'সন্ধ্যা'
  }

  return 'রাত'
}

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeBnBd, 'name', 'bn-BD')
setLocaleProperty(localeBnBd, 'meridiem', meridiem)

export default localeBnBd
