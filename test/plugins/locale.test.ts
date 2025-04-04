import type { EsDay } from 'esday'
import { esday } from 'esday'
import { describe, expect, it } from 'vitest'
import localeZh from '~/locales/zh'
import localePlugin, { type Locale } from '~/plugins/locale'

esday.extend(localePlugin)

const getLocaleName = (inst: EsDay) => inst['$conf']['$locale_name']

describe('factory locale methods', () => {
  it('set locale', () => {
    esday.locale('zh')
    expect(getLocaleName(esday())).toBe('zh')

    esday.locale('non-exist')
    expect(getLocaleName(esday())).toBe('non-exist')
  })

  it('get locale', () => {
    esday.locale('zh')
    expect(esday.locale()).toBe('zh')

    esday.locale('non-exist')
    expect(esday.locale()).toBe('non-exist')
  })

  it('register locale', () => {
    esday.registerLocale(localeZh)
    esday.locale('zh')
    expect(esday().localeObject()).toBe(localeZh)

    esday.registerLocale(localeZh, 'zh-cn')
    esday.locale('zh-cn')
    expect(esday().localeObject()).toBe(localeZh)
  })
})

describe('esDay locale methods', () => {
  const day = esday('2021-01-01')

  it('set locale for instance', () => {
    expect(getLocaleName(day)).toBe('en')
    const dayZh = day.locale('zh')
    expect(getLocaleName(dayZh)).toBe('zh')
  })

  it('start of', () => {
    esday.registerLocale({
      name: 'test',
      weekStart: 0,
    } as Locale)
    const dayTest = day.locale('test')
    expect(dayTest.startOf('week').format('YYYY-MM-DD')).toBe('2020-12-27')
    expect(dayTest.endOf('week').format('YYYY-MM-DD')).toBe('2021-01-02')
  })
})
