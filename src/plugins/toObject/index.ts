import type { EsDayPlugin } from 'esday'

declare module 'esday' {
  interface EsDay {
    toObject: () => {
      years: number
      months: number
      date: number
      hours: number
      minutes: number
      seconds: number
      milliseconds: number
    }
  }
}

const toObjectPlugin: EsDayPlugin<{}> = (_, dayClass) => {
  dayClass.prototype.toObject = function () {
    return {
      years: this.year(),
      months: this.month(),
      date: this.date(),
      hours: this.hour(),
      minutes: this.minute(),
      seconds: this.second(),
      milliseconds: this.millisecond(),
    }
  }
}

export default toObjectPlugin
