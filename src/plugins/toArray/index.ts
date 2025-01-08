import type { EsDayPlugin } from 'esday'

declare module 'esday' {
  interface EsDay {
    toArray: () => [number, number, number, number, number, number, number]
  }
}

const toArrayPlugin: EsDayPlugin<{}> = (_, dayClass) => {
  dayClass.prototype.toArray = function () {
    return [this.year(), this.month(), this.date(), this.hour(), this.minute(), this.second(), this.millisecond()]
  }
}

export default toArrayPlugin
