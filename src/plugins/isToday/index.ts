import type { EsDayPlugin } from 'esday'

declare module 'esday' {
  interface EsDay {
    isToday: () => boolean
  }
}

export const isTodayPlugin: EsDayPlugin = (_, dayClass) => {
  dayClass.prototype.isToday = function () {
    
    return true
  }
}
