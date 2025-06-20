# Set

EsDay has 2 methods to set the elements of a date: the specific setter (`year()`, `month()` etc.) and the generic setter (`set`).

The `year()` method sets the year of the date.

The `month()` method sets the month of the date (0-based, i.e. 0..11).

The `date()` method sets the day of the month of a date.

The `day()` method sets the day of the week of a date (0 .. 6). If a locale is loaded, '0' is the first day of the week as defined in the locale settings. Otherwise '0' is Sunday,'1' is Monday etc.

The `hour()` method sets the hour of the date (0..23).

The `minute()` method sets the minute of the date.

The `second()` method sets the second of the date.

The `millisecond()` method sets the millisecond of the date.

The `set` method takes a unit parameter to define, which value to set in a date.

All setters will bubble up to the next higher unit, If the range is exceeded. I.e. if minutes are set to a value higher than 59, the value will bubble up to hours etc.

## Usage

### Method signatures
```typescript
set(unit: UnitYears, year: number, month?: number, date?: number): EsDay
set(unit: UnitQuarters, quarter: number): EsDay
set(unit: UnitMonths, month: number, date?: number): EsDay
set(unit: UnitWeeks, week: number): EsDay
set(unit: UnitDates, date: number): EsDay
set(unit: UnitDays, day: number): EsDay
set(unit: UnitHours, hours: number, min?: number, sec?: number, ms?: number): EsDay
set(unit: UnitMins, min: number, sec?: number, ms?: number): EsDay
set(unit: UnitSeconds, sec: number, ms?: number): EsDay
set(unit: UnitMss, ms: number): EsDay
set(unit: UnitsObjectTypeSet): EsDay
```

| parameter | description                |
| --------- | -------------------------- |
| unit      | Unit to use for the getter |

### Available Units in UnitTypeGetSet

Short form: 'y', 'Q', 'M', 'w', 'd', 'D', 'h', 'm', 's' and 'ms'.
Long form: 'year', 'quarter', 'month', 'week', 'day', 'date', 'hour', 'minute', 'second' and 'millisecond'.
Plural form: 'years', 'quarters', 'months', 'weeks', 'days', 'dates', 'hours', 'minutes', 'seconds' and 'milliseconds'.

`UnitYears` means one of the 3 forms of units for years ('y', 'year' or 'years'). The same goes for the other units (like UnitQuarters, UnitMonths, etc.).

The unit `week` (in short, long and plural forms) requires the plugin 'week' to be loaded.
The unit `quarter` (in short, long and plural forms) requires the plugin 'quarterOfYear' to be loaded.

`UnitsObjectTypeSet` (an object containing several units and values to set) requires the plugin 'objectSupport'.

## Examples
```typescript
import { esday } from 'esday'

esday('2019-01-25').year(2025)
// Returns esday for '2025-01-25T00:00:00'

esday('2019-03-25T12:34:56.789').set(esday('month', 5)
// Returns esday for '2019-06-25T12:34:56.789'

esday('2019-01-25T12:34:56.789').set(esday('D', 5)
// Returns esday for '2019-01-05T12:34:56.789'

esday('2019-01-25T12:34:56.789').set(esday('d', 2)
// Returns esday for '2019-01-22T12:34:56.789', as no locale is loaded
```
