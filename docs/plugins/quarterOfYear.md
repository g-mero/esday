# QuarterOfYear

QuarterOfYear gets or sets the quarter and adds support for the formatting Token `Q`.
Setting the quarter does not affect the time of an EsDay instance.

## Method signatures
```typescript
esday().quarter(): number
esday().quarter(quarterNumber: number): EsDay
```

| parameter     | description                              |
| ------------- | ---------------------------------------- |
| quarterNumber | date string to be parsed                 |

## Formatting tokens
| **Token** | **Example** | **Description**                                        |
| --------- | ----------- | ------------------------------------------------------ |
| Q         | 1-4         | Quarter of year. |

## Examples
### quarter method
```typescript
import { esday } from 'esday'
import quarterOfYearPlugin from 'esday/plugins/quarterOfYear'

esday.extend(quarterOfYearPlugin)

esday('2023-08-14T21:43:12.123').quarter()
// Returns 3

esday('2023-08-14T21:43:12.123').quarter(1)
// Returns '2023-01-01T21:43:12.123' as EsDay
```

### Formatting date using token 'Q'
```typescript
esday('2023-08-14T21:43:12.123').format('YYYY Q')
// Returns '2023 3'
```
