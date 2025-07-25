# EsDay

EsDay is a JavaScript library inspired by [Day.js](https://github.com/iamkun/dayjs).

EsDay has an API largely similar to [Moment.js](https://momentjs.com/docs/) (v2.30.1) and Day.js (v1.11.13), but it is written in TypeScript and fully supports es modules. When there are differences between Moment.js and Day.js, the functionality of Moment.js is usually preferred.

## Core functions
The EsDay core module has many integrated functions. Details see documentation of [Core](./core/index.md).

## Locales
EsDay supports many locales. A list of the supported locales can be found in the [details page](./locales/index.md).

## Plugins
EsDay is extensible by plugins. A list of all available plugins can be found in the [plugin documentation](./plugins/index.md).

## Differences to Day.js

- **Locale**: Locale  is a Plugin; no default locale! Dayjs uses 'en-US' as default.
- **'Start of Week'**: Default 'Start of Week' is 1 ('Monday') as defined by ISO 8601. Dayjs uses 0 ('Sunday') as (as defined by the dafault locale 'en-US').
- **'Start of Year'**: Default 'Start of Year' is 4 (Jan 4th must be in the 1st week of the year) as defined by ISO 8601. Dayjs uses 1 (Jan 1st) as (as defined by the dafault locale 'en-US').
- **Invalid Date**: conforms to Moment.js and uses `Invalid date` instead of `Invalid Date`.

## Differences to Moment.js

Esday uses moment@2.30.1 as api reference.

- **toString**: conforms to Day.js and uses Date.toUTCString() (returning the date in RFC 7231 format 'ddd, DD MMM YYYY HH:mm:ss [GMT]') while moment uses the format 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ'.
- **toISOString**: conforms to Day.js and returns 'Invalid date' when called on an invalid date. In that case moment returns null (see [moment pr#3710](https://github.com/moment/moment/pull/3710)).
