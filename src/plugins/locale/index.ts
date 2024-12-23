/* eslint-disable dot-notation */
import type { EsDayPlugin, Locale, UnitType } from 'esday'
import * as C from '~/core/constant'
import { prettyUnit, undefinedOr } from '~/core/utils'
import en from '~/locales/en'

const LocaleStore: Map<string, Locale> = new Map()

let $localeGlobal = 'en'

export function getLocale(name: string): Locale {
  return LocaleStore.get(name) || en
}

export function registerLocale(locale: Locale, rename?: string): void {
  LocaleStore.set(rename || locale.name, locale)
}

declare module 'esday' {
/*   interface EsDay {
    $locale: () => Locale
  } */

  interface EsDay {
    locale: (localeName: string) => EsDay
  }

  interface EsDayFactory {
    /**
     * use locale as global
     */
    locale: (localeName: string) => EsDayFactory
    /**
     * register locale
     */
    registerLocale: (locale: Locale, rename?: string) => EsDayFactory
  }
}

export const localePlugin: EsDayPlugin<{}> = (_, dayClass, dayFactory) => {
  // @ts-expect-error $locale is private method
  dayClass.prototype.$locale = function () {
    // @ts-expect-error $l is private property
    return getLocale(this['$l'] || 'en')
  }

  // add locale method
  dayClass.prototype.locale = function (localeName: string) {
    const inst = this.clone()
    // @ts-expect-error $l is private property
    inst['$l'] = localeName

    return inst
  }

  // set $l in clone method
  const oldClone = dayClass.prototype['clone']
  dayClass.prototype['clone'] = function () {
    const inst = oldClone.call(this)
    // @ts-expect-error $l is private property
    inst['$l'] = this['$l']
    return inst
  }

  // set $l in parse method
  const oldParse = dayClass.prototype['parse']
  dayClass.prototype['parse'] = function (d: any, utc: boolean, ...others: any[]) {
    oldParse.call(this, d, utc, ...others)
    // @ts-expect-error $l is private property
    this['$l'] = $localeGlobal
  }

  // change startOf method
  const oldStartOf = dayClass.prototype['startOf']
  dayClass.prototype['startOf'] = function (unit: UnitType) {
    const p = prettyUnit(unit)
    const inst = oldStartOf.call(this, unit)
    if (p === C.W) {
      // default start of week is Monday
      const defaultStartOfWeek = 1
      // @ts-expect-error $locale is private method
      const weekStart = undefinedOr(inst.$locale().weekStart, defaultStartOfWeek)
      const diffToDefault = weekStart - defaultStartOfWeek

      if (diffToDefault !== 0) {
        return inst.add(diffToDefault, C.D)
      }
    }
    return inst
  }

  dayFactory.locale = function (localeName: string) {
    $localeGlobal = localeName
    return dayFactory
  }

  dayFactory.registerLocale = function (locale: Locale, rename?: string) {
    registerLocale(locale, rename)
    return dayFactory
  }
}
