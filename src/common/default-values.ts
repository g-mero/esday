import { isUndefined } from './is'

const defaultValues: Map<string, number> = new Map()

export function defaultVal(key: string): number
export function defaultVal(key: string, value: number): void
export function defaultVal(key: string, value?: number): number | void {
  if (!isUndefined(value)) {
    defaultValues.set(key, value)
  }
  return defaultValues.get(key)
}
