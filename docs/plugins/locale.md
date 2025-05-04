# Locale

Locale extends `esday` to support locales. The locale to use can be loaded from the corresponding locale file ([list of supported locales](../locales/locales.md)).

**Note**: the name of the locale (e.g. used for setting the locale) is case sensitive.

## Method signatures
For esday (`esday`)
```
// get / set name of global locale
locale(): string
locale(localeName: string): EsDay

// add a locale to the list of available locales
registerLocale(locale: Locale, newName?: string): EsDay

// get the locale object from the name of the locale
localeObject(name: string): Locale
```

For esday instance (`esday()`)
```
// get / set the locale of an esday instance
locale(): string
locale(name: string): EsDay
```

| Parameter | Type   | Description          |
| --------- | ------ | ---------------------|
| locale    | Locale | locale object to use |

## Locale object
### Properties

Properties of the `Locale` object:

| Property      | Type     | Description                                                                                                                |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------|
| name          | string   | Name of the locale (e.g. `en-US`)                                                                                          |
| weekdays \| DayNamesStandaloneFormat | DayNames | Array of the full day names (e.g. `['Sunday', 'Monday', ... ]`)                                                            |
| weekdaysShort | DayNames | Array of the short day names (e.g. `['Sun', 'Mon', ... ]`)                                                                 |
| weekdaysMin   | DayNames | Array of the short day names (e.g. `['Su', 'Mo', ... ]`)                                                                   |
| months        | MonthNames \| MonthNamesStandaloneFormat \| MonthNamesFunction | Array of the full month names (e.g. `['January', 'February', ... ]`) |
| monthsShort   | MonthNames \| MonthNamesStandaloneFormat \| MonthNamesFunction | Array of the short month names (e.g. `['Jan', 'Feb', ... ]`)         |
| ordinal       | function | Get the ordinal form of a number (e.g. `ordinal(1) // returns '1st'`)                                                      |
| weekStart     | number   | Which is the 1st day of the week - 0=Sunday, 1=Monday etc. (e.g. `1` for Monday)                                           |
| yearStart     | number   | Which date **must** be part of the 1st week of the year (e.g. `4` for Jan 4th)                                             |
| formats       | object   | Localized format tokens for parsing and formatting (e.g. `LT` or `LL`)                                                     |
| relativeTime  | <Relative, string | RelativeTimeElementFunction>[] \| Replacement strings for relative time values (e.g. `future: 'in %s'`)           |
| meridiem      | function | Get meridiem string for a time value (e.g. `pm`)                                                                           |

All properties are readonly.

### Months / MonthsShort / Weekdays

`months`, `monthsShort` and `weekdays` can have several formats.
+ Array of strings
+ Object with properties 'format', 'standalone' and 'isFormat'. For `months` and `monthsShort` 'isFormat' is optional.
+ A function object with properties 'format' and 'standalone'. The signature of this function is `(esdayInstance: EsDay, format: string): string`.

The object and function variants are for cases, when more processing is required, to get the name of a month / weekday  (e.g., if the grammar is different for different formats).
+ `standalone` is the subjective form.
+ `format` is the nominative form.

`isFormat` is a regular expression that is used to check, whether a 'format' string conforms to the requirements to use the `format` list of names. The default value is `/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/`.

The function variant of `months` and `monthsShort` return the name of the month that matches the 'month' property of the given esdayInstance.

## Examples

```typescript
import { esday } from 'esday'
import localeZhCn from 'esday/locales/zh-cn'
import localePlugin from 'esday/plugins/locale'

esday.extend(localePlugin)
esday.registerLocale(localeZhCn)

// set global locale
esday.locale('zh-CN')

// get global locale
console.log(esday.locale()) // 'zh-cn'

// set the locale of an esday object
const day = esday('2021-01-01').locale('en')
```
