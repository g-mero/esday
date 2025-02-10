import { esday } from 'esday'
import moment from 'moment'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { C } from '~/common'
import advancedParsePlugin from '~/plugins/advancedParse'
import { expectSame, expectSameResult } from '../util'

esday.extend(advancedParsePlugin)

describe('advancedParse plugin - default mode', () => {
  describe('parse with format as single string', () => {
    const fakeTimeAsString = '2023-12-17T03:24:46.234'

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(fakeTimeAsString))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it.each([
      { formatString: 'Y', sourceString: '0', expectedString: '0000-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '3', expectedString: '0003-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '-4', expectedString: '-0004-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '-53', expectedString: '-0053-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '68', expectedString: '0068-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '69', expectedString: '0069-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '87', expectedString: '0087-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '0000', expectedString: '0000-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '1870', expectedString: '1870-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '1923', expectedString: '1923-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '2000', expectedString: '2000-01-01T00:00:00' },
      { formatString: 'Y', sourceString: '2023', expectedString: '2023-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '0', expectedString: '2000-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '3', expectedString: '2003-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '-4', expectedString: '2004-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '00', expectedString: '2000-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '68', expectedString: '2068-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '69', expectedString: '1969-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '87', expectedString: '1987-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '-53', expectedString: '2053-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '1827', expectedString: '2018-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '2000', expectedString: '2020-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '1987', expectedString: '2019-01-01T00:00:00' },
      { formatString: 'YY', sourceString: '2068', expectedString: '2020-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '0', expectedString: '0000-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '3', expectedString: '0003-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '-4', expectedString: '0004-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '68', expectedString: '2068-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '69', expectedString: '1969-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '87', expectedString: '1987-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '-53', expectedString: '2053-01-01T00:00:00' },
      { formatString: 'YYYY', sourceString: '0000', expectedString: '0000-01-01T00:00:00' },
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
      { formatString: 'M', sourceString: '8', expectedString: '2023-08-01T00:00:00' },
      { formatString: 'M', sourceString: '08', expectedString: '2023-08-01T00:00:00' },
      { formatString: 'M', sourceString: '11', expectedString: '2023-11-01T00:00:00' },
    ])('parse month "$sourceString" with "$formatString"', ({ sourceString, formatString, expectedString }) => {
      expectSameResult(esday => esday(sourceString, formatString))
      // Remove offset from formatted string to make test runnable in every timezone
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
      { formatString: 'Q YYYY', sourceString: '2 22', expectedString: '2022-04-01T00:00:00' },
      { formatString: 'x', sourceString: '1442086062579', expectedString: '2015-09-12T21:27:42' },
      { formatString: 'X', sourceString: '1442086062.579', expectedString: '2015-09-12T21:27:42' },
      { formatString: 'X', sourceString: '1442086062', expectedString: '2015-09-12T21:27:42' },
    ])('parse date&time "$sourceString" with "$formatString"', ({ sourceString, formatString, expectedString }) => {
      expectSameResult(esday => esday(sourceString, formatString))
      // Remove offset from formatted string to make test runnable in every timezone
      expect(esday(sourceString, formatString).format().slice(0, -6)).toBe(expectedString)
    })

    it.each([
      { formatString: 'DD.MM.YYYY', sourceString: '31.12.2019', expectedString: '2019-12-31T00:00:00' },
      { formatString: 'DD.MM.YYYY', sourceString: '01.01.2019', expectedString: '2019-01-01T00:00:00' },
    ])('parse date&time edge case "$sourceString" with format "$formatString"', ({ sourceString, formatString, expectedString }) => {
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

    it('parse with remaining text in sourceString', () => {
      const sourceString = '2024/07/09 14:27:34.987 and many more characters'
      const formatString = 'YYYY-MM-DD HH-mm-ss-SSS'

      expectSameResult(esday => esday(sourceString, formatString))
    })

    it('parse with not enough text in sourceString', () => {
      const sourceString = '2024/07/09T21:27'
      const formatString = 'YYYY-MM-DD HH-mm-ss-SSS'

      expectSameResult(esday => esday(sourceString, formatString))
    })

    it('parse with text as separator', () => {
      const sourceString = '2024ppp07qqq09 21:27:34'
      const formatString = 'YYYY-MM-DD HH:mm:ss'

      expectSameResult(esday => esday(sourceString, formatString))
    })

    it('parse with escaped text as separator', () => {
      const sourceString = '2024/07/09 21H27m34'
      const formatString = 'YYYY-MM-DD HH[H]mm[m]ss'

      expectSameResult(esday => esday(sourceString, formatString))
    })

    it.each([
      { formatString: 'Q YYYY', sourceString: '02 2023' },
      { formatString: 'Q YYYY', sourceString: '54 2023' },
      { formatString: 'YYYY-MM-DD', sourceString: '1970-00-00' },
      { formatString: 'DD-MM-YYYY HH:mm:ss', sourceString: '35/22/2010 99:88:77' },
    ])('parse invalid date "$sourceString" with format "$formatString"', ({ sourceString, formatString }) => {
      const parsedEsday = esday(sourceString, formatString)

      expectSameResult(esday => esday(sourceString, formatString))
      expect(parsedEsday.isValid()).toBeFalsy()
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
    it.each([
      { name: 'last match', formatString: ['YYYY', 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'], sourceString: '2012-05-28 10:21:15', expectedString: '2012-05-28T10:21:15' },
      { name: 'first match', formatString: ['YYYY-MM-DD HH:mm:ss', 'YYYY', 'YYYY-MM-DD'], sourceString: '2012-11-28 20:21:15', expectedString: '2012-11-28T20:21:15' },
      { name: 'single entry', formatString: ['YYYY-MM-DD'], sourceString: '2012-11-28 20:21:15', expectedString: '2012-11-28T00:00:00' },
    ])('parse "$sourceString" with array - "$name"', ({ formatString, sourceString, expectedString }) => {
      expectSameResult(esday => esday(sourceString, formatString))
      // Remove offset from formatted string to make test runnable in every timezone
      expect(esday(sourceString, formatString).format().slice(0, -6)).toBe(expectedString)
    })

    it.each([
      { name: 'empty format', formatString: [''], sourceString: '2012-11-28 20:21:15', expectedString: C.INVALID_DATE_STRING },
      { name: 'no entry', formatString: [], sourceString: '2012-11-28 20:21:15', expectedString: C.INVALID_DATE_STRING },
    ])('parse "$sourceString" with invalid array - "$name"', ({ formatString, sourceString, expectedString }) => {
      expectSameResult(esday => esday(sourceString, formatString))
      expect(esday(sourceString, formatString).format()).toBe(expectedString)
      expect(esday(sourceString, formatString).isValid()).toBeFalsy()
    })
  })

  describe('parse in strict mode with format as single string', () => {
    const fakeTimeAsString = '2023-12-17T03:24:46.234'

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(fakeTimeAsString))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it.each([
      { formatString: 'MM-YYYY-DD HH:mm:ss.SSS', sourceString: '08-2023-14 21:43:12.123', expectedString: '2023-08-14T21:43:12' },
      { formatString: 'M-YY-D H:m:s.SS', sourceString: '8-23-14 21:43:12.13', expectedString: '2023-08-14T21:43:12' },
      { formatString: 'M', sourceString: '8', expectedString: '2023-08-01T00:00:00' },
      { formatString: 'Q YYYY', sourceString: '1 2023', expectedString: '2023-01-01T00:00:00' },
      { formatString: 'Q YYYY', sourceString: '2 2023', expectedString: '2023-04-01T00:00:00' },
      { formatString: 'Q YYYY', sourceString: '3 2023', expectedString: '2023-07-01T00:00:00' },
      { formatString: 'Q YYYY', sourceString: '4 2023', expectedString: '2023-10-01T00:00:00' },
      { formatString: 'x', sourceString: '1442086062579', expectedString: '2015-09-12T21:27:42' },
      { formatString: 'X', sourceString: '1442086062.579', expectedString: '2015-09-12T21:27:42' },
      { formatString: 'X', sourceString: '1442086062', expectedString: '2015-09-12T21:27:42' },
    ])('parse strict date&time "$sourceString" with "$formatString"', ({ sourceString, formatString, expectedString }) => {
      expectSameResult(esday => esday(sourceString, formatString, true))
      // Remove offset from formatted string to make test runnable in every timezone
      expect(esday(sourceString, formatString, true).format().slice(0, -6)).toBe(expectedString)
    })

    it.each([
      { formatString: 'DD.MM.YYYY', sourceString: '31.12.2019', expectedString: '2019-12-31T00:00:00' },
      { formatString: 'DD.MM.YYYY', sourceString: '01.01.2019', expectedString: '2019-01-01T00:00:00' },
    ])('parse strict date&time edge case "$sourceString" with format "$formatString"', ({ sourceString, formatString, expectedString }) => {
      expectSameResult(esday => esday(sourceString, formatString, true))
      // Remove offset from formatted string to make test runnable in every timezone
      expect(esday(sourceString, formatString, true).format().slice(0, -6)).toBe(expectedString)
    })

    it.each([
      { formatString: 'MM-YYYY-DD HH:mm:ss.SSS', sourceString: '8-2023-4 1:3:2.3' },
      { formatString: 'M-YY-D H:m:s.SS', sourceString: '08-2023-14 21:43:12.123' },
      { formatString: 'M-YY-D H:m:s.SS', sourceString: '08-2023-14 21:43:12.13' },
      { formatString: 'M-YY-D H:m:s.SS', sourceString: '8-23-4 1:3:2.3' },
      { formatString: 'Q YYYY', sourceString: '1 23' },
      { formatString: 'Q YYYY', sourceString: '02 23' },
      { formatString: 'x', sourceString: '1442086062.579' },
    ])('does not parse strict date&time "$sourceString" with "$formatString"', ({ sourceString, formatString }) => {
      const parsedDateEsDay = esday(sourceString, formatString, true)

      expect(parsedDateEsDay.isValid()).toBeFalsy()
      expectSame(esday => esday(sourceString, formatString, true).isValid())
    })

    it.each([
      { formatString: 'M-YY-D H:m:s.SS', sourceString: '08-2023-14 21:43:12.123', comment: '4-digit year' },
      { formatString: 'YY', sourceString: '2023', comment: '4-digit year' },
    ])('parsing should not be valid for "$sourceString" with "$formatString"', ({ sourceString, formatString }) => {
      const parsedDateEsDay = esday(sourceString, formatString, true)
      const parsedDateMoment = moment(sourceString, formatString, true)

      expect(parsedDateMoment.isValid()).toBeFalsy()
      expect(parsedDateEsDay.isValid()).toBeFalsy()
    })

    it.each([
      { formatString: 'DD.MM.YYYY', sourceString: '31.12.2019', expectedString: '2019-12-31T00:00:00' },
      { formatString: 'DD.MM.YYYY', sourceString: '01.01.2019', expectedString: '2019-01-01T00:00:00' },
    ])('parse date&time edge case "$sourceString" with format "$formatString"', ({ sourceString, formatString, expectedString }) => {
      expectSameResult(esday => esday(sourceString, formatString, true))
      // Remove offset from formatted string to make test runnable in every timezone
      expect(esday(sourceString, formatString, true).format().slice(0, -6)).toBe(expectedString)
    })
  })

  describe('parse in strict mode with format as array of strings', () => {
    it.each([
      { name: 'last match', formatString: ['YYYY', 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'], sourceString: '2012-05-28 10:21:15', expectedString: '2012-05-28T10:21:15' },
      { name: 'first match', formatString: ['YYYY-MM-DD HH:mm:ss', 'YYYY', 'YYYY-MM-DD'], sourceString: '2012-11-28 20:21:15', expectedString: '2012-11-28T20:21:15' },
    ])('parse "$sourceString" with array - "$name"', ({ formatString, sourceString, expectedString }) => {
      expectSameResult(esday => esday(sourceString, formatString, true))
      // Remove offset from formatted string to make test runnable in every timezone
      expect(esday(sourceString, formatString, true).format().slice(0, -6)).toBe(expectedString)
    })

    it.each([
      { name: 'missing token', formatString: ['YYYY-MM-DD'], sourceString: '2012-11-28 20:21:15' },
      { name: 'empty format', formatString: [''], sourceString: '2012-11-28 20:21:15' },
      { name: 'no entry', formatString: [], sourceString: '2012-11-28 20:21:15' },
    ])('parse "$sourceString" with invalid array - "$name"', ({ formatString, sourceString }) => {
      const parsedEsDay = esday(sourceString, formatString, true)
      const parsedMoment = moment(sourceString, formatString, true)

      expect(parsedMoment.isValid()).toBeFalsy()
      expect(parsedEsDay.isValid()).toBeFalsy()
    })
  })
})

// TODO add tests for utc in separate file
