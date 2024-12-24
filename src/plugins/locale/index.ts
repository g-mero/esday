/* eslint-disable dot-notation */
import type { EsDay, EsDayPlugin, UnitType } from 'esday'
import type { Locale } from './types'
import * as C from '~/core/constant'
import en from '~/locales/en'
import { prettyUnit, undefinedOr } from '~/utils'

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
    registerLocale: (locale: Locale, newName?: string) => EsDayFactory
  }
}

function getSetPrivateLocaleName(inst: EsDay, newLocaleName?: string): string {
  if (newLocaleName) {
    // @ts-expect-error $locale_name is private property
    inst['$locale_name'] = newLocaleName
  }

  // @ts-expect-error $locale_name is private property
  return inst['$locale_name'] || $localeGlobal
}

export const localePlugin: EsDayPlugin<{}> = (_, dayClass, dayFactory) => {
  // @ts-expect-error $locale is private method
  dayClass.prototype.$locale = function () {
    return getLocale(getSetPrivateLocaleName(this))
  }

  // add locale method
  dayClass.prototype.locale = function (localeName: string) {
    const inst = this.clone()
    getSetPrivateLocaleName(inst, localeName)

    return inst
  }

  // set $l in clone method
  const oldClone = dayClass.prototype['clone']
  dayClass.prototype['clone'] = function () {
    const inst = oldClone.call(this)
    getSetPrivateLocaleName(inst, getSetPrivateLocaleName(this))
    return inst
  }

  // set $locale_name in parse method
  const oldParse = dayClass.prototype['parse']
  dayClass.prototype['parse'] = function (d: any, utc: boolean, ...others: any[]) {
    oldParse.call(this, d, utc, ...others)

    // set locale name
    getSetPrivateLocaleName(this, $localeGlobal)
  }

  // change startOf/endOf method
  const oldStartOf = dayClass.prototype['startOf']
  const oldEndOf = dayClass.prototype['endOf']
  const fixDiff = (inst: any, unit: UnitType) => {
    if (prettyUnit(unit) === C.WEEK) {
      // default start of week is Monday
      const defaultStartOfWeek = C.INDEX_MONDAY
      const weekStart = undefinedOr(inst.$locale().weekStart, defaultStartOfWeek)
      const diffToDefault = weekStart - defaultStartOfWeek

      if (diffToDefault !== 0) {
        return inst.add(diffToDefault, C.DAY)
      }
    }

    return inst
  }
  dayClass.prototype['startOf'] = function (unit: UnitType) {
    const inst = oldStartOf.call(this, unit)
    return fixDiff(inst, unit)
  }
  dayClass.prototype['endOf'] = function (unit: UnitType) {
    const inst = oldEndOf.call(this, unit)
    return fixDiff(inst, unit)
  }

  dayFactory.locale = function (localeName: string) {
    $localeGlobal = localeName
    return dayFactory
  }

  dayFactory.registerLocale = function (locale: Locale, newName?: string) {
    registerLocale(locale, newName)
    return dayFactory
  }
}

export * from './types'
