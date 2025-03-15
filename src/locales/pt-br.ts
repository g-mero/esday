/**
 * Portuguese (Brazil) [pt-BR]
 */

import localePt from '~/locales/pt'
import { cloneLocale, setLocaleProperty } from '~/plugins/locale'

const localePtBr = cloneLocale(localePt)

const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
const weekdaysShort = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
const weekdaysMin = ['Do', '2ª', '3ª', '4ª', '5ª', '6ª', 'Sá']

const formats = structuredClone(localePtBr.formats)
formats.LLL = 'D [de] MMMM [de] YYYY [às] HH:mm'
formats.lll = 'D [de] MMMM [de] YYYY [às] HH:mm'
formats.LLLL = 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
formats.llll = 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'

const relativeTime = structuredClone(localePtBr.relativeTime)
relativeTime.s = 'poucos segundos'

// Use 'setLocaleProperty' as all properties are 'readonly'
setLocaleProperty(localePtBr, 'name', 'pt-BR')
setLocaleProperty(localePtBr, 'weekdays', weekdays)
setLocaleProperty(localePtBr, 'weekdaysShort', weekdaysShort)
setLocaleProperty(localePtBr, 'weekdaysMin', weekdaysMin)
setLocaleProperty(localePtBr, 'formats', formats)
setLocaleProperty(localePtBr, 'relativeTime', relativeTime)

export default localePtBr
