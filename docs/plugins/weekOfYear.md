# WeekOfYear

WeekOfYear adds the `week` and the  the `weeks` methods to EsDay to get or set the week of the year of a date according to the active locale. The `weeks` method is just an alias for the `week` method.

The week of the year varies depending on which day is the first day of the week (Sunday, Monday, etc), and with which day (of the month) the first week of the year starts.

For example, in the US, Sunday is the first day of the week. The week with January 1st in it is the first week of the year.

In France, Monday is the first day of the week, and the week with January 4th is the first week of the year.

When setting the week of the year, the day of the week is retained.

## Method signatures
```typescript
esday().week(): number
esday().week(week: number): EsDay
esday().weeks(): number
esday().weeks(week: number): EsDay
```

## Examples
```typescript
import { esday } from 'esday'
import weekYearOfPlugin from 'esday/plugins/weekOfYear'
import localeEn from 'esday/locales/en'
import localePlugin from 'esday/plugins/locale'

esday.extend(localePlugin)
esday.extend(weekOfYearPlugin)

esday.registerLocale(localeEn)

esday('2024-01-01')weekOfYear()
// Returns 1

esday('2024-02-14')weekYear(1)
// Returns esday for '2024-01-03'
```
