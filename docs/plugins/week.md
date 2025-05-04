# Week

Week adds the `week`, the `weeks` and the `weekYear` methods to EsDay.
The `week` method gets or sets the week of the year of a date according to the active locale.
The `weeks` method is just an alias for the `week` method.
The `weekYear` method gets the week-year of a date.

**week**
The week of the year varies depending on which day is the first day of the week (Sunday, Monday, etc), and with which day (of the month) the first week of the year starts.

For example, in the US, Sunday is the first day of the week. The week with January 1st in it is the first week of the year.

In France, Monday is the first day of the week, and the week with January 4th is the first week of the year.

When **setting** the week of the year, the day of the week is retained.

**week-year**
Because the first day of the first week of a year does not always fall on the first day of the year, sometimes the week-year will differ from the month year.
Because the first day of the first week of a year does not always fall on the first day of the year, sometimes the week-year will differ from the month year.

For example, in the US, the week that contains Jan 1st is always the first week. In the US, weeks also start on Sunday.
If Jan 1 was a Monday, Dec 31 would belong to the same week as Jan 1, and thus the same week-year as Jan 1 (e.g. 2024).
Dec 30 would have a different week-year than Dec 31 (in the previous case it would be 2023).

## Method signatures
```typescript
esday().week(): number
esday().week(week: number): EsDay
esday().weeks(): number
esday().weeks(week: number): EsDay
esday().weekYear(): number
```

## Examples
```typescript
import { esday } from 'esday'
import weekPlugin from 'esday/plugins/weekOfYear'
import localeEnUs from 'esday/locales/en-us'
import localePlugin from 'esday/plugins/locale'

esday.extend(localePlugin)
esday.extend(weekPlugin)

esday.registerLocale(localeEnUs)

// set global locale
esday.locale('en-US')

esday('2024-01-01').week()
// Returns 1

esday('2024-02-14').week(1)
// Returns esday for '2024-01-03'

esday('2023-12-30').weekYear()
// Returns 2023

esday('2023-12-31').weekYear()
// Returns 2024

esday('2024-01-01').weekYear()
// Returns 2024
```
