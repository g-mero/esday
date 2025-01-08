import { esday } from 'esday'
import moment from 'moment'
import { describe, expect, it } from 'vitest'
import toObjectPlugin from '~/plugins/toObject'

esday.extend(toObjectPlugin)

describe('toObject plugin', () => {
  it('should match moment.toObject for the same date', () => {
    const testDates = [
      '2025-01-01T00:00:00.000Z',
      '2023-06-15T12:34:56.789Z',
      '1999-12-31T23:59:59.999Z',
      '1970-01-01T00:00:00.000Z',
    ]

    testDates.forEach((dateString) => {
      const esdayDate = esday(dateString)
      const momentDate = moment(dateString)

      const esdayObject = esdayDate.toObject()
      const momentObject = momentDate.toObject()

      expect(esdayObject).toEqual(momentObject)
    })
  })

  it('should handle edge cases consistently with moment.toObject', () => {
    const edgeCases = [
      '1900-02-28T00:00:00.000Z',
      '2100-02-28T23:59:59.999Z',
      '2000-02-29T12:00:00.000Z',
      '2024-02-29T12:00:00.000Z',
    ]

    edgeCases.forEach((dateString) => {
      const esdayDate = esday(dateString)
      const momentDate = moment(dateString)

      const esdayObject = esdayDate.toObject()
      const momentObject = momentDate.toObject()

      expect(esdayObject).toEqual(momentObject)
    })
  })

  it('should return consistent results for the current date and time', () => {
    const now = new Date()
    const esdayDate = esday(now)
    const momentDate = moment(now)

    const esdayObject = esdayDate.toObject()
    const momentObject = momentDate.toObject()

    expect(esdayObject).toEqual(momentObject)
  })
})
