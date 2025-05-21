# DayOfYear

DayOfYear adds the `dayOfYear` method to EsDay to get or set the day of the year.

## Method signatures
```typescript
esday().dayOfYear(): number
esday().dayOfYear(dayOfYear: number): EsDay
```

## Examples
```typescript
import { esday } from 'esday'
import dayOfYearPlugin from 'esday/plugins/weekOfYear'

esday.extend(dayOfYearPlugin)

esday('2020-03-01').dayOfYear()
// Returns 61

esday('2020-01-01').dayOfYear(100)
// Returns esday for '2020-04-09'
```
