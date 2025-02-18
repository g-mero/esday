import type { Tuple } from '~/types/util-types'

export function parseArrayToDate(dateArray: number[]) {
  const dateArrayTuple: Tuple<number, 7> = [0, 0, 1, 0, 0, 0, 0]
  dateArray.forEach((value, index) => {
    if (value !== undefined) {
      dateArrayTuple[index] = value
    }
  })
  return new Date(...dateArrayTuple)
}
