# Difference

The `diff` method calculates the difference between two esday objects using the specified unit.

The default unit is milliseconds.

To get the difference in another unit of measurement, pass that measurement as the second argument.

By default `diff` will truncate the result to an integer. If you want a floating point number, pass true as the third argument.

## Usage

### Method signatures
```typescript
esday().diff(date: EsDay, unit?: UnitType, asFloat?: boolean): number
```

| parameter | description                                         |
| --------- | --------------------------------------------------- |
| date      | EsDay object to calculate the difference to         |
| unit      | Unit to use for the calculated difference           |
| asFloat   | return the result as float  (false= return integer) |

### Available Units in UnitType

'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute' and 'second'

## Examples
```typescript
import { esday } from 'esday'

// calculating difference with default unit ('milliseconds')
esday('2019-01-25').diff(esday('2018-06-05'))
// Returns 20214000000

// calculating difference with unit 'months'
esday('2019-01-25').diff(esday('2018-06-05'), 'month')
// Returns 7

// calculating difference with unit 'months' as float
esday('2019-01-25').diff(esday('2018-06-05'), 'month', true)
// Returns 7.645161290322581
```
