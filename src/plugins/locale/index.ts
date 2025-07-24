import type { DateType, EsDay, EsDayPlugin, UnitType } from 'esday'
import { C, normalizeUnit, undefinedOr } from '~/common'
import en from '~/locales/en'
import type { Locale } from './types'

const LocaleStore: Map<string, Locale> = new Map()

let $localeGlobal = 'en'

export function getLocale(name: string): Locale {
  return LocaleStore.get(name) || en
}

export function registerLocale(locale: Locale, rename?: string): void {
  LocaleStore.set(rename || locale.name, locale)
}

export function unregisterLocale(name: string): void {
  LocaleStore.delete(name)
}

function updateLocale(localeName: string, locale: Partial<Locale>): void {
  const existingLocale = getLocale(localeName)
  const updatedLocale = { ...existingLocale, ...locale }
  LocaleStore.set(localeName, updatedLocale)
}

/**
 * Same as 'setLocaleProperty', but for arbitrary objects to enable use
 * e.g. for cloning the 'relativeTime' property.
 * @param target - object whose property to create or set
 * @param propName - name of the property to create or set
 * @param newValue - new value of the property
 */
// biome-ignore lint/suspicious/noExplicitAny: generic function
function setObjectProperty(target: object, propName: string, newValue: any) {
  Object.defineProperty(target, propName, {
    enumerable: true,
    configurable: true,
    writable: false,
    value: newValue,
  })
}

/**
 * Set a property in a literal object avoiding a typescript error TS2322.
 * @param targetLocale - object whose property to create or set
 * @param propName - name of the property to create or set
 * @param newValue - new value of the property
 */
// biome-ignore lint/suspicious/noExplicitAny: generic function
export function setLocaleProperty(targetLocale: Locale, propName: string, newValue: any) {
  setObjectProperty(targetLocale, propName, newValue)
}

/**
 * Clone an object. Used for cloning a Locale, but with a generic
 * name, as we call it recursively.
 * @param sourceObject - object to clone
 * @returns cloned object with all properties set to 'readonly'.
 */
function cloneObject(sourceObject: object): object {
  const result = {}

  for (const [key, sourceValue] of Object.entries(sourceObject)) {
    if (
      typeof sourceValue === 'string' ||
      typeof sourceValue === 'number' ||
      typeof sourceValue === 'function'
    ) {
      setObjectProperty(result, key, sourceValue)
    } else if (Array.isArray(sourceValue)) {
      setObjectProperty(result, key, structuredClone(sourceValue))
    } else if (typeof sourceValue === 'object') {
      setObjectProperty(result, key, cloneObject(sourceValue))
    }
  }

  return result
}

/**
 * Clone a Locale. Used to create a locale for a territory based
 * on the locale of the corresponding language.
 * All properties of the cloned locale are 'readonly' and can only
 * be set by using the function 'setProperty'.
 * @param source - locale to clone
 * @returns cloned locale with all all properties set to 'readonly'.
 */
export function cloneLocale(source: Locale): Locale {
  return cloneObject(source) as Locale
}

function getSetPrivateLocaleName(inst: EsDay, newLocaleName?: string): string {
  if (newLocaleName) {
    inst['$conf']['$locale_name'] = newLocaleName
  }

  return (inst['$conf']['$locale_name'] as string) || $localeGlobal
}

const localePlugin: EsDayPlugin<{}> = (_, dayClass, dayFactory) => {
  dayClass.prototype.localeObject = function () {
    return getLocale(getSetPrivateLocaleName(this))
  }

  // @ts-expect-error function is compatible with its overload
  dayClass.prototype.locale = function (localeName?: string) {
    // dayClass.prototype.locale = function (localeName?: string): any {
    if (localeName === undefined) {
      // Getter
      return getSetPrivateLocaleName(this)
    }

    // Setter
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

  const oldParse = dayClass.prototype['$parse']
  dayClass.prototype['$parse'] = function (d: Exclude<DateType, EsDay>) {
    oldParse.call(this, d)

    // set locale name
    getSetPrivateLocaleName(this, $localeGlobal)
  }

  // change startOf/endOf method
  const oldStartOf = dayClass.prototype['startOf']
  const oldEndOf = dayClass.prototype['endOf']
  const fixDiff = (inst: EsDay, origin: EsDay, unit: UnitType, reverse = false) => {
    if (normalizeUnit(unit) === C.WEEK) {
      // default start of week is Monday
      const defaultStartOfWeek = C.INDEX_MONDAY
      const weekStart = undefinedOr(inst.localeObject().weekStart, defaultStartOfWeek)
      const $day = origin.day()
      const $date = origin.date()
      const diff = ($day < weekStart ? $day + 7 : $day) - weekStart

      return origin
        .date(reverse ? $date + (6 - diff) : $date - diff)
        .hour(inst.hour(), inst.minute(), inst.second(), inst.millisecond())
    }

    return inst
  }
  dayClass.prototype['startOf'] = function (unit: UnitType) {
    const inst = oldStartOf.call(this, unit)
    return fixDiff(inst, this, unit)
  }
  dayClass.prototype['endOf'] = function (unit: UnitType) {
    const inst = oldEndOf.call(this, unit)
    return fixDiff(inst, this, unit, true)
  }

  // @ts-expect-error function is compatible with its overload
  dayFactory.locale = (localeName?: string) => {
    if (localeName === undefined) {
      // Getter
      return $localeGlobal
    }

    // Setter
    $localeGlobal = localeName
    return dayFactory
  }

  dayFactory.registerLocale = (locale: Locale, newName?: string) => {
    registerLocale(locale, newName)
    return dayFactory
  }

  dayFactory.unregisterLocale = (localeName: string) => {
    unregisterLocale(localeName)
    return dayFactory
  }

  dayFactory.updateLocale = (localeName: string, locale: Partial<Locale>) => {
    updateLocale(localeName, locale)
    return dayFactory
  }
}

export default localePlugin

export * from './types'
