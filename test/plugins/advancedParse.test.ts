import { esday } from 'esday'
import moment from 'moment'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import advancedParsePlugin from '~/plugins/advancedParse'
import { expectSame, expectSameResult } from '../util'

esday.extend(advancedParsePlugin)

describe('advancedParse plugin - default mode', () => {
  describe('with format as single string', () => {
    const fakeTimeAsString = '2023-12-17T03:24:46.234'

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(fakeTimeAsString))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it.each([
      { formatString: 'YY', sourceString: '0', expectedString: '2000-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '3', expectedString: '2003-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '-4', expectedString: '2004-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '00', expectedString: '2000-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '68', expectedString: '2068-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '69', expectedString: '1969-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '87', expectedString: '1987-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '-53', expectedString: '2053-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '1827', expectedString: '2018-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '1987', expectedString: '2019-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '2068', expectedString: '2020-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '68', expectedString: '2068-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '69', expectedString: '1969-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '87', expectedString: '1987-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '-53', expectedString: '2053-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '1870', expectedString: '1870-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '1923', expectedString: '1923-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '2000', expectedString: '2000-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '2023', expectedString: '2023-01-01T00:00:00' },
    ])('parse year "$sourceString" with "$formatString"', ({ sourceString, formatString, expectedString }) => {
      expectSameResult(esday => esday(sourceString, formatString))
      // Remove offset from formatted string to make test runnable in every timezone
      expect(esday(sourceString, formatString).format().slice(0, -6)).toBe(expectedString)
    })

    it.each([
      { formatString: 'Y', sourceString: '0', expectedString: '2000-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '3', expectedString: '2003-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '-4', expectedString: '2004-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '68', expectedString: '2068-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '69', expectedString: '1969-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '87', expectedString: '1987-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '-53', expectedString: '2053-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '1870', expectedString: '2018-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '1923', expectedString: '2019-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '2000', expectedString: '2020-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '2023', expectedString: '2020-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '0', expectedString: '1900-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '3', expectedString: '1903-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '-4', expectedString: '1904-01-01T00:00:00' },
    ])('parse year "$sourceString" with "$formatString" - difference to moment.js', ({ sourceString, formatString, expectedString }) => {
      // Remove offset from formatted string to make result independent of utcOffset
      expect(esday(sourceString, formatString).format().slice(0, -6)).toBe(expectedString)
    })

    it.each([
      { formatString: 'S', sourceString: '0', expectedMS: 0 },
      { formatString: 'S', sourceString: '3', expectedMS: 300 },
      { formatString: 'S', sourceString: '14', expectedMS: 140 },
      { formatString: 'S', sourceString: '168', expectedMS: 168 },
      { formatString: 'S', sourceString: '2369', expectedMS: 236 },
      { formatString: 'S', sourceString: '23678901987', expectedMS: 236 },
      { formatString: 'SS', sourceString: '0', expectedMS: 0 },
      { formatString: 'SS', sourceString: '3', expectedMS: 300 },
      { formatString: 'SS', sourceString: '14', expectedMS: 140 },
      { formatString: 'SS', sourceString: '168', expectedMS: 168 },
      { formatString: 'SS', sourceString: '2369', expectedMS: 236 },
      { formatString: 'SS', sourceString: '23678901987', expectedMS: 236 },
      { formatString: 'SSS', sourceString: '0', expectedMS: 0 },
      { formatString: 'SSS', sourceString: '3', expectedMS: 300 },
      { formatString: 'SSS', sourceString: '14', expectedMS: 140 },
      { formatString: 'SSS', sourceString: '168', expectedMS: 168 },
      { formatString: 'SSS', sourceString: '2369', expectedMS: 236 },
      { formatString: 'SSS', sourceString: '23678901987', expectedMS: 236 },
    ])('parse milliseconds "$sourceString" with "$formatString" - difference to moment.js', ({ sourceString, formatString, expectedMS }) => {
      expect(esday(sourceString, formatString).millisecond()).toBe(expectedMS)
      expectSame(esday => esday(sourceString, formatString).millisecond())
    })

    it.each([
      { formatString: 'MM-YYYY-DD HH:mm:ss.SSS', sourceString: '08-2023-14 21:43:12.123', expectedString: '2023-08-14T21:43:12' },
      { formatString: 'MM-YYYY-DD HH:mm:ss.SSS', sourceString: '8-2023-4 1:3:2.3', expectedString: '2023-08-04T01:03:02' },
      { formatString: 'M-YY-D H:m:s.SS', sourceString: '08-2023-14 21:43:12.123', expectedString: '2020-08-14T21:43:12' },
      { formatString: 'M-YY-D H:m:s.SS', sourceString: '8-23-4 1:3:2.3', expectedString: '2023-08-04T01:03:02' },
      { formatString: 'Q YYYY', sourceString: '1 2023', expectedString: '2023-01-01T00:00:00' },
      { formatString: 'Q YYYY', sourceString: '2 2023', expectedString: '2023-04-01T00:00:00' },
      { formatString: 'Q YYYY', sourceString: '3 2023', expectedString: '2023-07-01T00:00:00' },
      { formatString: 'Q YYYY', sourceString: '4 2023', expectedString: '2023-10-01T00:00:00' },
      { formatString: 'x', sourceString: '1442086062579', expectedString: '2015-09-12T21:27:42' },
      { formatString: 'X', sourceString: '1442086062.579', expectedString: '2015-09-12T21:27:42' },
      { formatString: 'X', sourceString: '1442086062', expectedString: '2015-09-12T21:27:42' },
    ])('parse date&time "$sourceString" with "$formatString"', ({ sourceString, formatString, expectedString }) => {
      expectSameResult(esday => esday(sourceString, formatString))
      // Remove offset from formatted string to make test runnable in every timezone
      expect(esday(sourceString, formatString).format().slice(0, -6)).toBe(expectedString)
    })

    it.each([
      '-',
      '_',
      ',',
      '(',
      ')',
      '/',
    ])('using "%s" as separator', (sep) => {
      const sourceString = '17?12?2023?03?24?46?234'
      const formatString = `DD${sep}MM${sep}YYYY${sep}HH${sep}mm${sep}ss${sep}SSS`

      expectSameResult(esday => esday(sourceString, formatString))
    })

    it('parse with "." as separator', () => {
      const sourceString = '17.12.2023T03.12.46.234'
      const formatString = `DD.MM.YYYYTHH.mm.ss.SSS`

      expectSameResult(esday => esday(sourceString, formatString))
    })

    it('parse with ":" as separator', () => {
      const sourceString = '17:12:2023T03:12:46.234'
      const formatString = `DD:MM:YYYYTHH:mm:ss:SSS`

      expectSameResult(esday => esday(sourceString, formatString))
    })

    it('parse with different separator in source and format', () => {
      const sourceString = '2024/07/09T21:27:34.000'
      const formatString = 'YYYY-MM-DD HH-mm-ss-SSS'

      expectSameResult(esday => esday(sourceString, formatString))
    })

    it('parse with text as separator', () => {
      const inst = esday('2024年07月月09日日.00时', 'YYYY年MM月月DD日日.HH时')

      expect(inst.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-07-09 00:00:00')
    })

    it('parse invalid date with overflow', () => {
      const sourceString = '35/22/2010 99:88:77'
      const formatString = 'DD-MM-YYYY HH:mm:ss'
      const expectedString = '2011-11-08T04:29:17'
      const esdayParsed = esday(sourceString, formatString)
      const momentParsed = moment(sourceString, formatString)

      expect(esdayParsed.isValid()).toBeTruthy()
      expect(momentParsed.isValid()).toBeFalsy()
      // Remove offset from formatted string, as esday uses local timezone for offset
      expect(esday(sourceString, formatString).format().slice(0, -6)).toBe(expectedString)
    })

    it('parse invalid quarter with overflow', () => {
      const sourceString = '5 2023'
      const formatString = 'Q YYYY'
      const expectedString = '2024-01-01T00:00:00'
      const esdayParsed = esday(sourceString, formatString)
      const momentParsed = moment(sourceString, formatString)

      expect(esdayParsed.isValid()).toBeTruthy()
      expect(momentParsed.isValid()).toBeFalsy()
      // Remove offset from formatted string, as esday uses local timezone for offset
      expect(esday(sourceString, formatString).format().slice(0, -6)).toBe(expectedString)
    })

    it('parse with "0" as day or month (using default values)', () => {
      const sourceString = '1970-00-00'
      const formatString = 'YYYY-MM-DD'
      const expectedString = '1970-01-01T00:00:00'
      const esdayParsed = esday(sourceString, formatString)
      const momentParsed = moment(sourceString, formatString)

      expect(esdayParsed.isValid()).toBeTruthy()
      expect(momentParsed.isValid()).toBeFalsy()
      // Remove offset from formatted string, as esday uses local timezone for offset
      expect(esday(sourceString, formatString).format().slice(0, -6)).toBe(expectedString)
    })

    it('parse date not matching format', () => {
      const sourceString = '10/12/2014'
      const formatString = 'YYYY-MM-DD'
      const expectedString = '2010-12-20T00:00:00'

      expectSameResult(esday => esday(sourceString, formatString))
      // Remove offset from formatted string to make test runnable in every timezone
      expect(esday(sourceString, formatString).format().slice(0, -6)).toBe(expectedString)
    })

    it('parse invalid format ""', () => {
      const sourceString = ''
      const formatString = 'YYYY-MM-DD'

      expect(esday(sourceString, formatString).isValid()).toBeFalsy()
      expectSameResult(esday => esday(sourceString, formatString))
    })
  })

  describe('parse with format as array of strings', () => {
    // TODO activate after adding array formats to parse
    // it('first match vs. longest match', () => {
    //   const sourceString = '2012-05-28 10:21:15'
    //   const formatString =  ['YYYY', 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss']
    //   const expectedString = '2012-01-01 00:00:00' // moment: '2012-05-28 10:21:15'

    //   expectSameResult(esday => esday(sourceString, formatString))
    //   // Remove offset from formatted string to make test runnable in every timezone
    //   expect(esday(sourceString, formatString).format().slice(0, -6)).toBe(expectedString)
    // })
  })
})

it.todo('with strict mode')

// TODO add tests for utc in separate file
