# EsDay

EsDay is a JavaScript library inspired by [Day.js](https://github.com/iamkun/dayjs).

EsDay has an API largely similar to [Moment.js](https://momentjs.com/docs/) (v2.30.1) and Day.js (v1.11.13), but it is written in TypeScript and fully supports es modules. When there are differences between Moment.js and Day.js, the functionality of Moment.js is usually preferred.

## Core functions
EsDay has many integrated functions:
- [diff](./core/diff.md) calculating the difference between 2 esday objects based on a given unit.
- [formatting](./core/format.md) an esday object as a string

## Locales
EsDay supports many locales. A list of the supported locales can be found in the [details page](./locales/locales.md).

## Plugins
EsDay is extensible by plugins.

Currently there are the following plugins:
- [AdvancedParse](./plugins/advancedParse.md) (for parsing arbitrary formatted date and time strings)
- [AdvancedFormat](./plugins/advancedFormat.md) (for formatting using a custom template)
- IsBetween (IsBetween adds .isBetween() API - is date is between two other dates)
- IsLeapYear (IsLeapYear adds .isLeapYear() API - is year a leap year)
- IsSameOrAfter (IsSameOrAfter adds .isSameOrAfter() API - is date the same or after another date)
- IsSameOrBefore (IsSameOrBefore adds .isSameOrBefore() API - is date the same or before another date)
- IsToday (IsToday adds .isToday() API is date today)
- [Locale](./plugins/locale.md) (add locale functions to EsDay)
- [LocalizedParse](./plugins/localizedParse.md) (for parsing locale dependant tokens in arbitrary formatted date and time strings)
- MinMax (MinMax adds .min() and .max() APIs - find the minimum or maximum of several dates)
- [QuarterOfYear](./plugins/quarterOfYear.md) (QuarterOfYear adds .quarter() getter and setter APIs and formatter token 'Q' - handle quarter of year)
- ToArray (ToArray adds .toArray() API - get an array with the components of a date)
- ToObject (ToObject adds .toObject() API - get an object with the components of a date)
- Utc (UTC adds .utc(), .local() and .isUTC APIs - handle dates as UTC)
- [WeekOfYear](./plugins/weekOfYear.md) (WeekOfYear adds .week() API - get the week of the year of a date)
- [WeekYear](./plugins/weekYear.md) (WeekYear adds .weekYear() API - get locale aware week-year of a date)

## Differences to Day.js

- **Locale**: Locale  is a Plugin; no default locale! Dayjs uses 'en-US' as default.
- **'Start of Week'**: Default 'Start of Week' is 1 ('Monday') as defined by ISO 8601. Dayjs uses 0 ('Sunday') as (as defined by the dafault locale 'en-US').
- **'Start of Year'**: Default 'Start of Year' is 4 (Jan 4th must be in the 1st week of the year) as defined by ISO 8601. Dayjs uses 1 (Jan 1st) as (as defined by the dafault locale 'en-US').

## Differences to Moment.js

Esday uses moment@2.30.1 as api reference.

- **toString**: conforms to Day.js and uses Date.toUTCString() (returning the date in RFC 7231 format 'ddd, DD MMM YYYY HH:mm:ss [GMT]') while moment uses the format 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ'.
- **toISOString**: conforms to Day.js and returns 'Invalid Date' when called on an invalid date. In that case moment returns null (see [moment pr#3710](https://github.com/moment/moment/pull/3710)).
