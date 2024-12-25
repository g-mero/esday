import dayjs from 'dayjs'
import dayjsUTC from 'dayjs/plugin/utc'
import { esday } from 'esday'
import { expect, it } from 'vitest'
import { utcPlugin } from '~/plugins/utc'

dayjs.extend(dayjsUTC)
esday.extend(utcPlugin)

it('parse normal string', () => {
  const parseStr = '2024-12-25 12:34:56'

  expect(esday.utc(parseStr).format()).toBe(dayjs.utc(parseStr).format())
  expect(esday(parseStr).utc().format()).toBe(dayjs(parseStr).utc().format())
})

it('get utc field value', () => {
  const parseStr = '2024-12-25 12:34:56';
  (['year', 'month', 'date', 'hour', 'minute', 'second', 'ms'] as const).forEach((field) => {
    expect(esday.utc(parseStr).get(field)).toBe(dayjs.utc(parseStr).get(field))
  })
})
