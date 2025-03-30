# Locale

Locale extends `esday` to support locales. The locale to use can be loaded from the corresponding locale file.

## Method signatures
For esday (`esday`)
```
// get / set name of global locale
locale(): string
locale(localeName: string): EsDayFactory

// add a locale to the list of available locales
registerLocale(locale: Locale, newName?: string): EsDayFactory

// get the locale object from the name of the locale
getLocale(name: string): Locale
```

For esday instance (`esday()`)
```
// set the locale of an esday object
locale(name: string): EsDay
```

| parameter | description                              |
| --------- | ---------------------------------------- |
| locale    | locale object to use                     |

# Examples

```typescript
import { esday } from 'esday'
import localeZhCn from 'esday/locales/zh-cn'
import localePlugin from 'esday/plugins/locale'

esday.extend(localePlugin)
esday.registerLocale(localeZhCn)

// set global locale
esday.locale('zh-cn')

// get global locale
console.log(esday.locale()) // 'zh-cn'

// set the locale of an esday object
const day = esday('2021-01-01').locale('en')
```
