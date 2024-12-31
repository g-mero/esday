/* eslint-disable dot-notation */
import type { EsDay, EsDayPlugin, UnitType } from 'esday'
import type { Locale } from './types'
import { C, prettyUnit, undefinedOr } from '~/common'
import en from '~/locales/en'

const LocaleStore: Map<string, Locale> = new Map()

let $localeGlobal = 'en'

export function getLocale(name: string): Locale {
  return LocaleStore.get(name) || en
}

export function registerLocale(locale: Locale, rename?: string): void {
  LocaleStore.set(rename || locale.name, locale)
}

function getSetPrivateLocaleName(inst: EsDay, newLocaleName?: string): string {
  if (newLocaleName) {
    inst['$conf']['$locale_name'] = newLocaleName
  }

  return inst['$conf']['$locale_name'] as string || $localeGlobal
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

  const oldParse = dayClass.prototype['parse']
  dayClass.prototype['parse'] = function (d: any) {
    oldParse.call(this, d)

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
