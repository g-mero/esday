/* eslint-disable dot-notation */
import { esday } from 'esday'
import { describe, expect, it } from 'vitest'
import localeZh from '~/locales/zh'
import { localePlugin } from '~/plugins/locale'

esday.extend(localePlugin)

describe('factory locale methods', () => {
  it('set locale', () => {
    esday.locale('zh')
    // @ts-expect-error $locale_name is private property
    expect(esday()['$locale_name']).toBe('zh')

    esday.locale('non-exist')
    // @ts-expect-error $locale_name is private property
    expect(esday()['$locale_name']).toBe('non-exist')
  })

  it('register locale', () => {
    esday.registerLocale(localeZh)
    esday.locale('zh')
    // @ts-expect-error $locale is private method
    expect(esday().$locale()).toBe(localeZh)

    esday.registerLocale(localeZh, 'zh-cn')
    esday.locale('zh-cn')
    // @ts-expect-error $locale is private method
    expect(esday().$locale()).toBe(localeZh)
  })
})

describe('esDay locale methods', () => {
  const day = esday('2021-01-01')
  it('set locale for instance', () => {
    // @ts-expect-error $locale_name is private property
    expect(day['$locale_name']).toBe('en')
    const dayZh = day.locale('zh')
    // @ts-expect-error $locale_name is private property
    expect(dayZh['$locale_name']).toBe('zh')
  })

  it('start of', () => {
    esday.registerLocale({
      name: 'test',
      weekStart: 0,
    } as any)
    const dayTest = day.locale('test')
    // @ts-expect-error $locale is private method
    expect(dayTest.$locale().weekStart).toBe(0)
    expect(dayTest.startOf('week').format('YYYY-MM-DD')).toBe('2020-12-27')
    expect(dayTest.endOf('week').format('YYYY-MM-DD')).toBe('2021-01-02')
  })
})
