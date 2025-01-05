import type { EsDayPlugin } from 'esday'

declare module 'esday' {
  interface EsDay {
    isToday: () => boolean
  }
}

const isTodayPlugin: EsDayPlugin<{}> = (_, dayClass) => {
  dayClass.prototype.isToday = function () {
    return this.isSame(new Date(), 'day')
  }
}

export default isTodayPlugin
