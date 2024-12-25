export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

export function undefinedOr<T, U>(v: T | undefined, or: U): T | U {
  return isUndefined(v) ? or : v
}

export function isEmptyObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null && Object.keys(value).length === 0
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value)
}
