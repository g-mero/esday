/**
 * Bengali (Bangladesh) [bn-BD]
 */

import localeBn from '~/locales/bn'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeBnBd = cloneLocale(localeBn)

// eslint-disable-next-line  unused-imports/no-unused-vars
function meridiem(hour: number, minute: number, isLowercase: boolean) {
  if (hour < 4) {
    return 'রাত'
  }
  else if (hour < 6) {
    return 'ভোর'
  }
  else if (hour < 12) {
    return 'সকাল'
  }
  else if (hour < 15) {
    return 'দুপুর'
  }
  else if (hour < 18) {
    return 'বিকাল'
  }
  else if (hour < 20) {
    return 'সন্ধ্যা'
  }
  else {
    return 'রাত'
  }
}

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeBnBd, 'name', 'bn-BD')
setLocaleProperty(localeBnBd, 'meridiem', meridiem)

export default localeBnBd
