/* eslint-disable dot-notation */
import type { EsDay } from 'esday'

export function createInstanceFromExist(d: Date, existInst: EsDay) {
  const newInst = existInst.clone()
  newInst['$d'] = d

  return newInst
}
