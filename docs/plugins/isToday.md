# IsToday

IsToday adds the `isToday` method to EsDay indicating, if a date is today.

## Method signatures
```typescript
esday().isToday(): boolean
```

## Examples
```typescript
import { esday } from 'esday'
import isTodayPlugin from 'esday/plugins/isToday'

esday.extend(isTodayPlugin)

esday().isToday()
// Returns true
```
