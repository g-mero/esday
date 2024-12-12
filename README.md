## esday

![npm](https://img.shields.io/npm/v/esday)

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
