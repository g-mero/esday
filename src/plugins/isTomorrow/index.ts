import type { EsDayPlugin } from 'esday'

declare module 'esday' {
  interface EsDay {
    isTomorrow: () => boolean
  }
}

const isTomorrowPlugin: EsDayPlugin<{}> = (_, dayClass, d) => {
  dayClass.prototype.isTomorrow = function () {
    const comparisonTemplate = 'YYYY-MM-DD'
    const tomorrow = d().add(1, 'day')

    return this.format(comparisonTemplate) === tomorrow.format(comparisonTemplate)
  }
}

export default isTomorrowPlugin
