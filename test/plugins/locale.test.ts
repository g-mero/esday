import type { EsDay } from 'esday'
import { esday } from 'esday'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import localeZh from '~/locales/zh'
// import localePlugin, { getLocale, type Locale } from '~/plugins/locale'
import { type Locale, getLocale, localePlugin } from '~/plugins'

esday.extend(localePlugin)

const getLocaleName = (inst: EsDay) => inst['$conf']['$locale_name']

describe('factory locale methods', () => {
  const fakeTimeAsString = '2023-12-13T03:24:46.234'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))
  })

  afterEach(() => {
    esday.locale('en')
    esday.unregisterLocale('zh').unregisterLocale('zh-cn').unregisterLocale('test')
    vi.useRealTimers()
  })

  it('get Locale zh from LocaleStore', () => {
    esday.registerLocale(localeZh)
    const locale = getLocale('zh')

    expect(locale).toBeTypeOf('object')
    expect(locale.name).toBe('zh')
  })

  it('get default Locale if not registered', () => {
    const locale = getLocale('ar')

    expect(locale).toBeTypeOf('object')
    expect(locale.name).toBe('en')
  })

  it('register locale "zh"', () => {
    esday.registerLocale(localeZh)
    esday.locale('zh')
    expect(esday().localeObject()).toBe(localeZh)
  })

  it('register locale "zh-cn"', () => {
    esday.registerLocale(localeZh, 'zh-cn')
    esday.locale('zh-cn')
    expect(esday().localeObject()).toBe(localeZh)
  })

  it('get global locale "zh"', () => {
    esday.locale('zh')
    expect(esday.locale()).toBe('zh')
  })

  it('get global locale "non-exist"', () => {
    esday.locale('non-exist')
    expect(esday.locale()).toBe('non-exist')
  })

  it('set global locale "zh"', () => {
    esday.locale('zh')
    expect(getLocaleName(esday())).toBe('zh')
  })

  it('set global locale "non-exist"', () => {
    esday.locale('non-exist')
    expect(getLocaleName(esday())).toBe('non-exist')
  })
})

describe('instance locale methods', () => {
  const fakeTimeAsString = '2023-12-13T03:24:46.234'
  let globalLocale: string

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(fakeTimeAsString))
    globalLocale = esday.locale()
    esday.locale('en')
  })

  afterEach(() => {
    esday.locale(globalLocale)
    vi.useRealTimers()
  })

  it('get locale of instance', () => {
    expect(esday().locale()).toBe('en')
  })

  it('set locale for instance', () => {
    // make sure that the current locale is not 'zh'
    expect(esday().locale()).toBe('en')

    // set locale to 'zh'
    const dayZh = esday().locale('zh')
    expect(dayZh.locale()).toBe('zh')
  })

  it('set locale-dependant startOf for "week" for weekStart=6', () => {
    esday.registerLocale({
      name: 'test',
      weekStart: 6, // Saturday
    } as Locale)
    const dayTest = esday().locale('test')

    expect(dayTest.startOf('week').format().slice(0, -6)).toBe('2023-12-09T03:24:46')
  })

  it('set locale-dependant startOf for "week" for weekStart=0', () => {
    esday.registerLocale({
      name: 'test',
      weekStart: 0, // Sunday
    } as Locale)
    const dayTest = esday().locale('test')

    expect(dayTest.startOf('week').format('YYYY-MM-DD')).toBe('2023-12-10')
  })

  it('set locale-dependant endOf for "week"', () => {
    esday.registerLocale({
      name: 'test',
      weekStart: 0, // Sunday
    } as Locale)
    const dayTest = esday().locale('test')

    expect(dayTest.endOf('week').format('YYYY-MM-DD')).toBe('2023-12-16')
  })
})
