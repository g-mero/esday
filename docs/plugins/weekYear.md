# WeekYear

WeekYear adds the `weekYear` method to EsDay to get the week-year of a date.

Because the first day of the first week of a year does not always fall on the first day of the year, sometimes the week-year will differ from the month year.

For example, in the US, the week that contains Jan 1st is always the first week. In the US, weeks also start on Sunday.
If Jan 1 was a Monday, Dec 31 would belong to the same week as Jan 1, and thus the same week-year as Jan 1 (e.g. 2024).
Dec 30 would have a different week-year than Dec 31 (in the previous case it would be 2023).

## Dependencies

The `WeekYear` plugin requires the plugin `WeekOfYear`. This plugin must be activated before the plugin WeekYear.

## Method signatures
```typescript
esday().weekYear(): number
```

## Examples
```typescript
import { esday } from 'esday'
import weekOfYearPlugin from 'esday/plugins/weekOfYear'
import weekYearPlugin from 'esday/plugins/weekYear'

esday.extend(weekOfYearPlugin)
esday.extend(weekYearPlugin)

esday('2023-12-30')weekYear()
// Returns 2023

esday('2023-12-31')weekYear()
// Returns 2024

esday('2024-01-01')weekYear()
// Returns 2024
```
