# Get

EsDay has 2 methods to get the elements of a date: the specific getter (`year()`, `month()` etc.) and the generic getter (`get`).

The `year()` method gets the year of the date.

The `month()` method gets the month of the date (0-based, i.e. 0..11).

The `date()` method gets the day of the month of a date.

The `day()` method gets the day of the week of a date (0 .. 6). If a locale is loaded, '0' is the first day of the week as defined in the locale settings. Otherwise '0' is Sunday,'1' is Monday etc.

The `hour()` method gets the hour of the date (0..23).

The `minute()` method gets the minute of the date.

The `second()` method gets the second of the date.

The `millisecond()` method gets the millisecond of the date.

The `get` method takes a unit parameter to define, which value to extract from a date.

## Usage

### Method signatures
```typescript
esday().get(unit: UnitTypeGetSet): number
```

| parameter | description                |
| --------- | -------------------------- |
| unit      | Unit to use for the getter |

### Available Units in UnitTypeGetSet

Short form: 'y', 'Q', 'M', 'w', 'd', 'D', 'h', 'm', 's' and 'ms'.
Long form: 'year', 'quarter', 'month', 'week', 'day', 'date', 'hour', 'minute', 'second' and 'millisecond'.
Plural form: 'years', 'quarters', 'months', 'weeks', 'days', 'dates', 'hours', 'minutes', 'seconds' and 'milliseconds'.

The unit `week` (in short, long and plural forms) requires the plugin 'week' to be loaded.
The unit `quarter` (in short, long and plural forms) requires the plugin 'quarterOfYear' to be loaded.

## Examples
```typescript
import { esday } from 'esday'

esday('2019-01-25').year()
// Returns 2019

esday('2019-03-25').get(esday('month')
// Returns 2 as the result is 0-based

esday('2019-01-25').get(esday('D')
// Returns 25

esday('2019-01-25').get(esday('d')
// Returns 5 for Friday, as no locale is loaded
```
