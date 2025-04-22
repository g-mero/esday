# IsYesterday

IsYesterday adds the `isYesterday` method to EsDay indicating, if a date is tomorrow.

## Method signatures
```typescript
esday().isYesterday(): boolean
```

## Examples
```typescript
import { esday } from 'esday'
import isYesterdayPlugin from 'esday/plugins/isYesterday'

esday.extend(isYesterdayPlugin)

esday().isYesterday()
// Returns false

esday().subtract(1, 'day').isYesterday()
// Returns true
```
