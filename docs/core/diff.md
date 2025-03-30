# Difference

The `diff` method calculates the difference between two esday objects using the specified unit.

The default unit is milliseconds.

To get the difference in another unit of measurement, pass that measurement as the second argument.

By default `diff` will truncate the result to an integer. If you want a floating point number, pass true as the third argument.

## Method signatures
```
esday().diff(date: EsDay, unit?: UnitType, asFloat?: boolean): number
```
| parameter | description                                         |
| --------- | --------------------------------------------------- |
| date      | EsDay object to calculate the difference to         |
| unit      | Eunit to use for the calculated difference          |
| asFloat   | return the result as float  (false= return integer) |

## Available Units in UnitType
| **Unit** | **Shorthand**                       | **Description**                                            |
| --------- | --------------------------------- | ---------------------------------------------------------- |
| YY        | 1                                 | Two-digit year                                             |
| YYYY      | 2001                              | Four-digit year                                            |
| M         | 1-12                              | Month, beginning at 1                                      |
| MM        | 01-12                             | Month, 2-digits                                            |
| D         | 1-31                              | Day of month                                               |
| DD        | 01-31                             | Day of month, 2-digits                                     |
| H         | 0-23                              | Hours                                                      |
| HH        | 00-23                             | Hours, 2-digits                                            |
| m         | 0-59                              | Minutes                                                    |
| mm        | 00-59                             | Minutes, 2-digits                                          |
| s         | 0-59                              | Seconds                                                    |
| ss        | 00-59                             | Seconds, 2-digits                                          |
| SSS       | 000-999                           | Milliseconds, 3-digits                                     |
| Z         | +05:00:00                         | Offset from UTC                                            |

## Examples
```typescript
import { esday } from 'esday'

// calculating difference with default unit ('milliseconds')
esday('2019-01-25').diff(esday(('2018-06-05'))
// Returns 20214000000

// calculating difference with unit 'months'
esday('2019-01-25').diff(esday(('2018-06-05'), 'month')
// Returns 7

// calculating difference with unit 'months' as float
esday('2019-01-25').diff(esday(('2018-06-05'), 'month', true)
// Returns 7.645161290322581
```
