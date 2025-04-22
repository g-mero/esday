# IsTomorrow

IsTomorrow adds the `isTomorrow` method to EsDay indicating, if a date is tomorrow.

## Method signatures
```typescript
esday().isTomorrow(): boolean
```

## Examples
```typescript
import { esday } from 'esday'
import isTomorrowPlugin from 'esday/plugins/isTomorrow'

esday.extend(isTomorrowPlugin)

esday().isTomorrow()
// Returns false

esday().add(1, 'day').isTomorrow()
// Returns true
```
