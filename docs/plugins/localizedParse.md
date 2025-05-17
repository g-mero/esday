# LocalizedParse

LocalizedParse extends the `esday` constructor to support localized formats of input strings.

The locale to use for parsing can be defined as 3rd parameter. If no locale is given, then the current global locale is used (defaults to 'en', which is a duplicate of 'en-US').

## Method signatures
```typescript
esday(date: string, format: string): EsDay
esday(date: string, format: string[]): EsDay
esday(date: string, format: string, strict: boolean): EsDay
esday(date: string, format: string[], strict: boolean): EsDay
esday(date: string, format: string, locale: string): EsDay
esday(date: string, format: string[], locale: string): EsDay
esday(date: string, format: string, locale: string, strict: boolean): EsDay
esday(date: string, format: string[], locale: string, strict: boolean): EsDay
```
and for the `utc` plugin
```typescript
esday.utc(date: string, format: string): EsDay
esday.utc(date: string, format: string[]): EsDay
esday.utc(date: string, format: string, strict: boolean): EsDay
esday.utc(date: string, format: string[], strict: boolean): EsDay
esday.utc(date: string, format: string, locale: string): EsDay
esday.utc(date: string, format: string[], locale: string): EsDay
esday.utc(date: string, format: string, locale: string, strict: boolean): EsDay
esday.utc(date: string, format: string[], locale: string, strict: boolean): EsDay
```

| parameter | description                              |
| --------- | ---------------------------------------- |
| date      | date string to be parsed                 |
| format    | format string(s) used for parsing `date` |
| strict    | date string must match format exactly    |

If an array of formats is used, `date` will be parsed with the best matching format in this array.

## Parsing tokens
| **Token** | **Example**                         | **Description**                                   |
| --------- | ----------------------------------- | ------------------------------------------------- |
| h         | 1...12                              | Hours, 12-hour clock                              |
| hh        | 01...12                             | Hours, 12-hour clock, 2-digits                    |
| A         | AM PM                               | Post or ante meridiem, upper-case                 |
| a         | am pm                               | Post or ante meridiem, lower-case                 |
| dd        | Su...Sa                             | Day of week (minimal form)                        |
| ddd       | Sun...Sat                           | Day of week (short form)                          |
| dddd      | Sunday...Saturday                   | Day of week (long form)                           |
| Do        | 1st...31st                          | Day of Month with ordinal                         |
| MMM       | Jan...Dec                           | Month name (short form)                           |
| MMMM      | January...December                  | Month name (long form)                            |
| LT        | 8:02 PM                             | Time                                              |
| LTS       | 8:30:25 PM                          | Time with seconds                                 |
| L         | 09/04/1986                          | Month numeral, day of month, year                 |
| LL        | September 4, 1986                   | Month name, day of month, year                    |
| LLL       | September 4, 1986 8:30 PM           | Month name, day of month, year, time              |
| LLLL      | Thursday, September 4, 1986 8:30 PM | Month name, day of month, day of week, year, time |
| l         | 9/4/1986                            | Month numeral, day of month, year                 |
| ll        | Sep 4, 1986                         | Month name, day of month, year                    |
| lll       | Sep 4, 1986 8:30 PM                 | Month name, day of month, year, time              |
| llll      | Thu, Sep 4, 1986 8:30 PM            | Month name, day of month, day of week, year, time |

## Dependencies
LocalizedParse requires the plugins AdvancedParse and Locale and at least 1 registered and activated locale.

The plugin AdvancedParse must be loaded using esday.extend(...) before the plugin LocalizedParse.

LocalizedParse can be used together with the plugin Utc that must be loaded using esday.extend(...) before the plugin AdvancedParse.

## Examples
Basic example with some localized tokens.
```
import { esday } from 'esday'
import { advancedParsePlugin, localePlugin, localizedParsePlugin } from 'esday/plugins'
import localeZhCn from 'esday/locales/zh-cn'

esday.extend(advancedParsePlugin)
esday.extend(localePlugin)
esday.extend(localizedParsePlugin)

esday.registerLocale(localeZhCn)

// set global locale
esday.locale('zh-cn')

const parsedDate = esday('2024 12月 24日 星期二 8:10:21 早上', 'YYYY MMM Do dddd H:mm:SS A')
```

Example with locale given as parameter of esday.
```
import { esday } from 'esday'
import { advancedParsePlugin, localePlugin, localizedParsePlugin } from 'esday/plugins'
import localeZhCn from 'esday/locales/zh-cn'

esday.extend(advancedParsePlugin)
esday.extend(localePlugin)
esday.extend(localizedParsePlugin)

esday.registerLocale(localeEn-US)
esday.registerLocale(localeZhCn)

// default global locale is 'en' (i.e. 'en-US')

const parsedDate = esday('2024 12月 24日 星期二 8:10:21 早上', 'YYYY MMM Do dddd H:mm:SS A', 'zh-CN')
```
