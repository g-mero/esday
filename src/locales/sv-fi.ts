/**
 * Finland Swedish [sv-FI]
 */

import localeSv from '~/locales/sv'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localeSvFi = cloneLocale(localeSv)

const formats = {
  LT: 'HH.mm',
  LTS: 'HH.mm.ss',
  L: 'DD.MM.YYYY',
  LL: 'D. MMMM YYYY',
  LLL: 'D. MMMM YYYY, [kl.] HH.mm',
  LLLL: 'dddd, D. MMMM YYYY, [kl.] HH.mm',
  l: 'D.M.YYYY',
  ll: 'D. MMM YYYY',
  lll: 'D. MMM YYYY, [kl.] HH.mm',
  llll: 'ddd, D. MMM YYYY, [kl.] HH.mm',
}

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localeSvFi, 'name', 'sv-FI')
setLocaleProperty(localeSvFi, 'formats', formats)

export default localeSvFi
