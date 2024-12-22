// English [en]

import type { Locale } from '~/types'

export default {
  name: 'en',
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ordinal: (n) => {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return `[${n}${(s[(v - 20) % 10] || s[v] || s[0])}]`
  },
} as Locale
