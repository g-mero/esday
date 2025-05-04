import { esday } from 'esday'
import { beforeEach, describe, expect, it } from 'vitest'
import { expectSame, expectSameResult } from '../util'

import moment from 'moment/min/moment-with-locales'
import localeDe from '~/locales/de'
import localeEn from '~/locales/en'
import localeHr from '~/locales/hr'
import { advancedParsePlugin, localePlugin, localizedParsePlugin, utcPlugin } from '~/plugins'

esday.extend(utcPlugin)
esday.extend(advancedParsePlugin)
esday.extend(localizedParsePlugin)
esday.extend(localePlugin)
esday.registerLocale(localeEn)
esday.registerLocale(localeDe)
esday.registerLocale(localeHr)

describe('localizedParse plugin - parsed as utc for "en"', () => {
  beforeEach(() => {
    // set global locale
    esday.locale('en')
  })

  it.each([
    { sourceString: '2024 Dec 23 14:25:36', formatString: 'YYYY MMM DD HH:mm:SS' },
    { sourceString: '2024 December 23 14:25:36', formatString: 'YYYY MMMM DD HH:mm:SS' },
    { sourceString: '2024 12 24 Tu 14:25:36', formatString: 'YYYY MM DD dd HH:mm:SS' },
    { sourceString: '2024 12 24 Tue 14:25:36', formatString: 'YYYY MM DD ddd HH:mm:SS' },
    { sourceString: '2024 12 24 Tuesday 14:25:36', formatString: 'YYYY MM DD dddd HH:mm:SS' },
    { sourceString: '2024 12 23rd 14:25:36', formatString: 'YYYY MM Do HH:mm:SS' },
    { sourceString: '2024-02-29 8:10:21 am', formatString: 'YYYY-MM-DD h:mm:SS a' },
    { sourceString: '2024-02-29 08:10:21 am', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 8:10:21 AM', formatString: 'YYYY-MM-DD h:mm:SS A' },
    { sourceString: '2024-02-29 08:10:21 AM', formatString: 'YYYY-MM-DD hh:mm:SS A' },
    { sourceString: '2024-02-29 8:10:21 pm', formatString: 'YYYY-MM-DD h:mm:SS a' },
    { sourceString: '2024-02-29 08:10:21 pm', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 8:10:21 PM', formatString: 'YYYY-MM-DD h:mm:SS A' },
    { sourceString: '2024-02-29 08:10:21 PM', formatString: 'YYYY-MM-DD hh:mm:SS A' },
    { sourceString: '2024-02-29 12:00:00 pm', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 12:00:01 pm', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 12:00:00 am', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 12:00:00 AM', formatString: 'YYYY-MM-DD hh:mm:SS A' },
    { sourceString: '2024-02-29 15:26:37 pm', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 15:26:37 am', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 8:10:21 xy', formatString: 'YYYY-MM-DD h:mm:SS A' },
    { sourceString: '2024 12 24 4:25 PM', formatString: 'YYYY MM DD LT' },
    { sourceString: '2024 12 24 4:25:36 PM', formatString: 'YYYY MM DD LTS' },
    { sourceString: '12/24/2024', formatString: 'L' },
    { sourceString: '4 [de] December [de] 2024', formatString: 'LL' },
    { sourceString: '4 [de] December [de] 2024 4:25 PM', formatString: 'LLL' },
    { sourceString: 'Wednesday, 4 [de] December [de] 2024 4:25 PM', formatString: 'LLLL' },
    { sourceString: '12/24/2024', formatString: 'l' },
    { sourceString: '4 [de] December [de] 2024', formatString: 'll' },
    { sourceString: '4 [de] December [de] 2024 4:25 PM', formatString: 'lll' },
    { sourceString: 'Wednesday, 4 [de] December [de] 2024 4:25 PM', formatString: 'llll' },
    { sourceString: '2024 12 24 [L lll ka] 4:25:36 PM', formatString: 'YYYY MM DD [L lll ka] LTS' },
  ])(
    'parse date string "$sourceString" with format "$formatString"',
    ({ sourceString, formatString }) => {
      expectSameResult((esday) => esday.utc(sourceString, formatString))
    },
  )

  it.each([
    { sourceString: '2024 12 24 Wed 14:25:36', formatString: 'YYYY MM DD ddd HH:mm:SS' },
    { sourceString: '2024-02-29 08:10:21 pM', formatString: 'YYYY-MM-DD hh:mm:SS a' },
  ])(
    'parse date string "$sourceString" with format "$formatString" as invalid date',
    ({ sourceString, formatString }) => {
      expectSame((esday) => esday.utc(sourceString, formatString).isValid())
    },
  )

  it('parse in strict mode - good format', () => {
    const sourceString = '2024 Dec 24th Tuesday 8:10:21 PM'
    const formatString = 'YYYY MMM Do dddd h:mm:SS A'

    expect(esday.utc(sourceString, formatString, true).isValid()).toBeTruthy()
    expectSameResult((esday) => esday.utc(sourceString, formatString, true))
  })

  it('does not parse in strict mode - bad format', () => {
    const sourceString = '2024 Dec 24th Tuesday 8:10:21'
    const formatString = 'YYYY MMM Do dddd h:mm:SS A'

    expect(esday.utc(sourceString, formatString, true).isValid()).toBeFalsy()
    expectSame((esday) => esday.utc(sourceString, formatString, true).isValid())
  })
})

describe('localizedParse plugin - parsed as utc for "de"', () => {
  beforeEach(() => {
    // set global locale
    esday.locale('de')
    moment.locale('de')
  })

  it.each([
    { sourceString: '2024 Dez. 23 14:25:36', formatString: 'YYYY MMM DD HH:mm:SS' },
    { sourceString: '2024 Dezember 23 14:25:36', formatString: 'YYYY MMMM DD HH:mm:SS' },
    { sourceString: '2024 12 24 Di 14:25:36', formatString: 'YYYY MM DD dd HH:mm:SS' },
    { sourceString: '2024 12 24 Di. 14:25:36', formatString: 'YYYY MM DD ddd HH:mm:SS' },
    { sourceString: '2024 12 24 Dienstag 14:25:36', formatString: 'YYYY MM DD dddd HH:mm:SS' },
    { sourceString: '2024 12 23. 14:25:36', formatString: 'YYYY MM Do HH:mm:SS' },
    { sourceString: '2024-02-29 8:10:21 am', formatString: 'YYYY-MM-DD h:mm:SS a' },
    { sourceString: '2024-02-29 08:10:21 am', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 8:10:21 AM', formatString: 'YYYY-MM-DD h:mm:SS A' },
    { sourceString: '2024-02-29 08:10:21 AM', formatString: 'YYYY-MM-DD hh:mm:SS A' },
    { sourceString: '2024-02-29 8:10:21 pm', formatString: 'YYYY-MM-DD h:mm:SS a' },
    { sourceString: '2024-02-29 08:10:21 pm', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 8:10:21 PM', formatString: 'YYYY-MM-DD h:mm:SS A' },
    { sourceString: '2024-02-29 08:10:21 PM', formatString: 'YYYY-MM-DD hh:mm:SS A' },
    { sourceString: '2024-02-29 12:00:00 pm', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 12:00:01 pm', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 12:00:00 am', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 12:00:00 AM', formatString: 'YYYY-MM-DD hh:mm:SS A' },
    { sourceString: '2024-02-29 15:26:37 pm', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 15:26:37 am', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 8:10:21 xy', formatString: 'YYYY-MM-DD h:mm:SS A' },
    { sourceString: '2024 12 24 14:25', formatString: 'YYYY MM DD LT' },
    { sourceString: '2024 12 24 14:25:36', formatString: 'YYYY MM DD LTS' },
    { sourceString: '24.12.2024', formatString: 'L' },
    { sourceString: '24. Dezember 2024', formatString: 'LL' },
    { sourceString: '24. Dezember 2024 14:25', formatString: 'LLL' },
    { sourceString: 'Mittwoch, 24. Dezember 2024 14:25', formatString: 'LLLL' },
    { sourceString: '24.12.2024', formatString: 'l' },
    { sourceString: '24. Dez. 2024', formatString: 'll' },
    { sourceString: '24. Dez. 2024 14:25', formatString: 'lll' },
    { sourceString: 'Mittwoch, 24. Dez. 2024 14:25', formatString: 'llll' },
    { sourceString: '2024 12 24 [L lll ka] 14:25:36', formatString: 'YYYY MM DD [L lll ka] LTS' },
  ])(
    'parse date string "$sourceString" with format "$formatString"',
    ({ sourceString, formatString }) => {
      expectSameResult((esday) => esday.utc(sourceString, formatString))
    },
  )

  it.each([
    { sourceString: '2024 12 24 Mi. 14:25:36', formatString: 'YYYY MM DD ddd HH:mm:SS' },
    { sourceString: '2024-02-29 08:10:21 pM', formatString: 'YYYY-MM-DD hh:mm:SS a' },
  ])(
    'parse date string "$sourceString" with format "$formatString" as invalid date',
    ({ sourceString, formatString }) => {
      expectSame((esday) => esday.utc(sourceString, formatString).isValid())
    },
  )

  it('parse in strict mode - good format', () => {
    const sourceString = '2024 Dez. 24. Dienstag 8:10:21 PM'
    const formatString = 'YYYY MMM Do dddd h:mm:SS A'

    expect(esday.utc(sourceString, formatString, true).isValid()).toBeTruthy()
    expectSameResult((esday) => esday.utc(sourceString, formatString, true))
  })

  it('does not parse in strict mode - bad format', () => {
    const sourceString = '2024 Dez. 24. Dienstag 8:10:21'
    const formatString = 'YYYY MMM Do dddd h:mm:SS A'

    expect(esday.utc(sourceString, formatString, true).isValid()).toBeFalsy()
    expectSame((esday) => esday.utc(sourceString, formatString, true).isValid())
  })
})

describe('localizedParse plugin - parsed as utc for "hr"', () => {
  beforeEach(() => {
    // set global locale
    esday.locale('hr')
    moment.locale('hr')
  })

  it.each([
    { sourceString: '2024 pro. 23 14:25:36', formatString: 'YYYY MMM DD HH:mm:SS' },
    { sourceString: '2024 prosinac 23 14:25:36', formatString: 'YYYY MMMM DD HH:mm:SS' },
    { sourceString: '2024 12 24 ut 14:25:36', formatString: 'YYYY MM DD dd HH:mm:SS' },
    { sourceString: '2024 12 24 uto. 14:25:36', formatString: 'YYYY MM DD ddd HH:mm:SS' },
    { sourceString: '2024 12 24 utorak 14:25:36', formatString: 'YYYY MM DD dddd HH:mm:SS' },
    { sourceString: '2024 12 23. 14:25:36', formatString: 'YYYY MM Do HH:mm:SS' },
    { sourceString: '2024-02-29 8:10:21 am', formatString: 'YYYY-MM-DD h:mm:SS a' },
    { sourceString: '2024-02-29 08:10:21 am', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 8:10:21 AM', formatString: 'YYYY-MM-DD h:mm:SS A' },
    { sourceString: '2024-02-29 08:10:21 AM', formatString: 'YYYY-MM-DD hh:mm:SS A' },
    { sourceString: '2024-02-29 8:10:21 pm', formatString: 'YYYY-MM-DD h:mm:SS a' },
    { sourceString: '2024-02-29 08:10:21 pm', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 8:10:21 PM', formatString: 'YYYY-MM-DD h:mm:SS A' },
    { sourceString: '2024-02-29 08:10:21 PM', formatString: 'YYYY-MM-DD hh:mm:SS A' },
    { sourceString: '2024-02-29 12:00:00 pm', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 12:00:01 pm', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 12:00:00 am', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 12:00:00 AM', formatString: 'YYYY-MM-DD hh:mm:SS A' },
    { sourceString: '2024-02-29 15:26:37 pm', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 15:26:37 am', formatString: 'YYYY-MM-DD hh:mm:SS a' },
    { sourceString: '2024-02-29 8:10:21 xy', formatString: 'YYYY-MM-DD h:mm:SS A' },
    { sourceString: '2024 12 24 14:25', formatString: 'YYYY MM DD LT' },
    { sourceString: '2024 12 24 24:25:36', formatString: 'YYYY MM DD LTS' },
    { sourceString: '24.12.2024', formatString: 'L' },
    { sourceString: '24. prosinac 2024', formatString: 'LL' },
    { sourceString: '24. prosinac 2024 8:25', formatString: 'LLL' },
    { sourceString: 'utorak, 24. prosinac 2024 14:25', formatString: 'LLLL' },
    { sourceString: '24.12.2024', formatString: 'l' },
    { sourceString: '24. pro. 2024', formatString: 'll' },
    { sourceString: '24. pro. 2024 4:25', formatString: 'lll' },
    { sourceString: 'uto., 24. pro. 2024 9:25', formatString: 'llll' },
    { sourceString: '2024 12 24 [L lll ka] 4:25:36 PM', formatString: 'YYYY MM DD [L lll ka] LTS' },
  ])(
    'parse date string "$sourceString" with format "$formatString"',
    ({ sourceString, formatString }) => {
      expectSameResult((esday) => esday.utc(sourceString, formatString))
    },
  )

  it.each([
    { sourceString: '2024 12 24 sri 14:25:36', formatString: 'YYYY MM DD ddd HH:mm:SS' },
    { sourceString: '2024-02-29 08:10:21 pM', formatString: 'YYYY-MM-DD hh:mm:SS a' },
  ])(
    'parse date string "$sourceString" with format "$formatString" as invalid date',
    ({ sourceString, formatString }) => {
      expectSame((esday) => esday.utc(sourceString, formatString).isValid())
    },
  )

  it('parse in strict mode - good format', () => {
    const sourceString = '2024 pro. 24. utorak 8:10:21 PM'
    const formatString = 'YYYY MMM Do dddd h:mm:SS A'

    expect(esday.utc(sourceString, formatString, true).isValid()).toBeTruthy()
    expectSameResult((esday) => esday.utc(sourceString, formatString, true))
  })

  it('does not parse in strict mode - bad format', () => {
    const sourceString = '2024 pro. 24. utorak 8:10:21'
    const formatString = 'YYYY MMM Do dddd h:mm:SS A'

    expect(esday.utc(sourceString, formatString, true).isValid()).toBeFalsy()
    expectSame((esday) => esday.utc(sourceString, formatString, true).isValid())
  })
})

describe('localizedParse plugin - local mode using locale given as parameter', () => {
  beforeEach(() => {
    // set global locale
    esday.locale('en')
    moment.locale('en')
  })

  it.each([
    {
      sourceString: '2024 pro. 24. utorak 8:10:21 PM',
      formatString: 'YYYY MMM Do dddd h:mm:SS A',
      locale: 'hr',
    },
    {
      sourceString: '2024 Dez. 24. Dienstag 8:10:21 PM',
      formatString: 'YYYY MMM Do dddd h:mm:SS A',
      locale: 'de',
    },
  ])(
    'parse in "en" with "$locale" as locale parameter',
    ({ sourceString, formatString, locale }) => {
      expect(esday(sourceString, formatString, locale).isValid()).toBeTruthy()
      expectSameResult((esday) => esday.utc(sourceString, formatString, locale))
    },
  )
})
