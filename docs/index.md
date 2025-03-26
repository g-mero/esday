# EsDay

EsDay is a JavaScript library inspired by [Day.js](https://github.com/iamkun/dayjs).

EsDay has an API largely similar to [Moment.js](https://momentjs.com/docs/) (v2.30.1) and Day.js (v1.11.13), but it is written in TypeScript and fully supports es modules. When there are differences between Moment.js and Day.js, the functionality of Moment.js is usually preferred.

EsDay supports many locales. A list of the supported locales can be found in the [details page](./locales/locales.md).

EsDay is extensible by plugins.

Currently there are the following plugins:
- AdvancedParse (parsing arbitrary formatted date and time strings)
- IsBetween (adds .isBetween() API - is date is between two other dates)
- IsLeapYear (adds .isLeapYear() API - is year a leap year)
- IsSameOrAfter (adds .isSameOrAfter() API - is date the same or after another date)
- IsSameOrBefore (adds .isSameOrBefore() API - is date the same or before another date)
- IsToday (adds .isToday() API is date today)
- Locale (locale functions for EsDay library)
- MinMax (adds .min() and .max() APIs - find the minimum or maximum of several dates)
- ToArray (adds .toArray() API - get an array with the components of a date)
- ToObject (adds .toObject() API - get an object with the components of a date)
- Utc (adds .utc(), .local() and .isUTC APIs - handle dates as UTC)
- WeekOfYear (adds .week() API - get the week of the year of a date)
- WeekYear (adds .weekYear() API - get locale aware week of the year of a date)
