## esday

![npm](https://img.shields.io/npm/v/esday) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

> 🚧 working in progress

> esday is a JavaScript library inspired by [Day.js](https://github.com/iamkun/dayjs), esday has a largely similar API to Day.js (v1.11.13), but it is written in TypeScript and fully supports es modules.

```javascript
import { esday } from 'esday'
import { isTodayPlugin } from 'esday/plugins/isToday'

esday.extend(isTodayPlugin)

esday('2024-12-10').set('year', 2025).add(1, 'month').isToday()
```

## Concepts

- **Modern API**: Provides the same API as Day.js, with some features moved to plugins for a simpler core.
- **Immutable**: esday is immutable, which means that all operations will return a new instance of esday.

## Differences to Day.js

- **Locale is a Plugin**: no default locale!
- **default value for 'Start of Week' is 1 (as in ISO 8601)**: 'Start of Week' is 1 ('Monday').
- **default value for 'Start of Year' is 4 (as in ISO 8601)**: 'Start of Year' is 4.

## Differences to Moment.js

- **toString** conforms to Day.js and uses Date.toUTCString() (returning the date in RFC 7231 format 'ddd, DD MMM YYYY HH:mm:ss [GMT]') while moment uses the format 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ'.

## License

This project is licensed under the [MIT License](LICENSE).

This project also partially contains code derived or copied from the following projects:

- [Day.js](https://github.com/iamkun/dayjs)
