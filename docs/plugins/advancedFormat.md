# AdvancedFormat

AdvancedFormat extends `esday` to support a custom formatting template.

## Method signatures
### formatting using a given format template:
```
esday().format(formatTemplate: string): string
```

| parameter      | description                                   |
| -------------- | --------------------------------------------- |
| formatTemplate | template used for formatting the EsDay object |

### Adding new formatting tokens:
```
esday.addTokenDefinitions(newTokens: TokenDefinitions)
```

**Format of TokenDefinitions**
```typescript
type TokenDefinitions = Record<string, [RegExp, RegExp, (this: ParsedElements, input: string) => void]>
```

| parameter          | type     | description                                      |
| ------------------ | -------- | ------------------------------------------------ |
| token              | string   | token to be parsed (e.g. 'Q')                    |
| regex default mode | RegExp   | regex used for parsing in default mode           |
| regex strict mode  | RegExp   | regex used for parsing in strict mode            |
| setter             | function | function to add parsed value to result in 'this' |

**Parameters of setter**
| parameter | type           | description                   |
| --------- | -------------- | ----------------------------- |
| this      | ParsedElements | object for results of parsing |
| input     | string         | parsed value                  |

**Format of ParsedElements**
```typescript
interface ParsedElements {
  year?: number
  month?: number
  day?: number
  hours?: number
  minutes?: number
  seconds?: number
  milliseconds?: number
  zoneOffset?: number
  unix?: number
}
```

## Parsing tokens
| **Token** | **Example**   | **Description**                    |
| --------- | --------------| ---------------------------------- |
| d         | 0-6           | Day of the week, with Sunday as 0  |
| S         | 0-9           | Hundreds of milliseconds, 1-digit  |
| SS        | 00-99         | Tens of milliseconds, 2-digits     |
| ZZ        | \-0500        | Compact offset from UTC, 2-digits  |
| X         | 1410715640579 | Unix timestamp                     |
| x         | 1410715640579 | Unix ms timestamp                  |
| k         | 1-24          | Hour with 0 -> 24                  |
| kk        | 01-24         | Hour, 2-digits, with 0 -> 24       |

## Examples
### Formatting
```typescript
import { esday } from 'esday'
import advancedFormatPlugin from 'esday/plugins/advancedParse'

esday.extend(advancedFormatPlugin)

esday('08-2023-14 21:43:12.123').format('MM-YYYY-DD HH:mm:ss.SSS')
// Returns '2023-08-14T21:43:12.123'
```

### Adding new formatting tokens
This functionality is above all for plugin developers
```typescript
const additionalTokens: TokenDefinitions = {
  PP: [/\d\d?/, /\d{2}/, function (input) {
    // in this example we don't use the parsed value ('input')
    this.milliseconds = 987
  }],
}
esday.addTokenDefinitions(additionalTokens)

esday('2024 3').format('YYYY PP')
// Returns '2023-08-14T21:43:12.123'
```
