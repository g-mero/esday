import type { Locale } from '~/types'
import en from '~/locale/en'

const LocaleStore: Map<string, Locale> = new Map()

export function getLocale(name: string): Locale {
  return LocaleStore.get(name) || en
}

export function registerLocale(locale: Locale): void {
  LocaleStore.set(locale.name, locale)
}
