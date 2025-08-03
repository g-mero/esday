# RelativeTime

RelativeTime adds the `fromNow`,  `toNow`, `from` and the `to` methods to EsDay to format a date as a relative time string (e.g. '3 hours ago').

The `fromNow` method returns a string of a time relative to 'now' (e.g. '4 years ago').
The `toNow` method returns the opposite value of `fromNow` (e.g. 'in 4 years').
The `from`  method returns a string of a time relative to a given date (e.g. '3 hours ago').
The `to` method returns the opposite value of `from` (e.g. 'in 3 hours').

## Usage

### Dependencies
RelativeTime requires the plugin Locale and at least 1 registered and activated locale.

### Method signatures
```typescript
esday().fromNow(withoutSuffix?: boolean): string
esday().toNow(withoutSuffix?: boolean): string
esday().from(referenceDate: DateType, withoutSuffix?: boolean): string
esday().to(referenceDate: DateType, withoutSuffix?: boolean): string
```

| parameter     | description                                 |
| ------------- | ------------------------------------------- |
| withoutSuffix | generate relative time without 'in' / 'ago' |
| referenceDate | date to refer to (instead of 'now')         |

Passing true as `withoutSuffix`, the methods return the value without the suffix (e.g. '4 years' instead of 'in 4 years').

The returned strings are defined by the current locale. `future` and `past` define the corresponding suffixes to use (default to 'in' / 'ago').

Time is rounded to the nearest second.

The breakdown of which string is displayed for each length of time is outlined in the table below
('key' is the key in the definition of `relativeTime` in the current locale):
| Range                       | Key | Sample Output                               |
| --------------------------- | --- | ------------------------------------------- |
| 0 to 44 seconds             | s   | a few seconds ago                           |
| 45 to 89 seconds            | m   | a minute ago                                |
| 90 seconds to 44 minutes    | mm  | 2 minutes ago ... 44 minutes ago            |
| 45 to 89 minutes            | h   | an hour ago                                 |
| 90 minutes to 21 hours      | hh  | 2 hours ago ... 21 hours ago                |
| 22 to 35 hours              | d   | a day ago                                   |
| 36 hours to 25 days         | dd  | 2 days ago ... 25 days ago                  |
| 26 to 45 days               | M   | a month ago                                 |
| 45 to 319 days              | MM  | 2 months ago ... 10 months ago              |
| 320 to 547 days (1.5 years) | y   | a year ago                                  |
| 548 days+                   | yy  | 2 years ago ... 20 years ago                |

The used thresholds can be overwritten, when activating the plugin by using an object with a property named `thresholds` as second parameter.

The default threshold list looks like this;
```typescript
[
    { key: 's', thresholdValue: 44, thresholdUnit: C.SECOND },
    { key: 'ss', thresholdValue: 43, thresholdUnit: C.SECOND },
    { key: 'm', thresholdValue: 89, thresholdUnit: C.SECOND },
    { key: 'mm', thresholdValue: 44, thresholdUnit: C.MIN },
    { key: 'h', thresholdValue: 89, thresholdUnit: C.MIN },
    { key: 'hh', thresholdValue: 21, thresholdUnit: C.HOUR },
    { key: 'd', thresholdValue: 35, thresholdUnit: C.HOUR },
    { key: 'dd', thresholdValue: 25, thresholdUnit: C.DAY },
    { key: 'M', thresholdValue: 45, thresholdUnit: C.DAY },
    { key: 'MM', thresholdValue: 10, thresholdUnit: C.MONTH },
    { key: 'y', thresholdValue: 17, thresholdUnit: C.MONTH },
    { key: 'yy', thresholdUnit: C.YEAR },
  ]
```

## Examples
```typescript
import { localePlugin, relativeTimePlugin } from 'esday/plugins'
import localeEn from 'esday/locales/en'

esday.extend(localePlugin)
esday.extend(relativeTimePlugin)

esday.registerLocale(localeEn)

esday([2007, 0, 29]).fromNow()
// Returns '4 years ago'

esday([2007, 0, 29]).fromNow(true)
// Returns '4 years'

const dateA = esday([2007, 0, 28]);
const dateB = esday([2007, 0, 29]);
dateA.to(dateB)
// Returns 'in a day'

const startDate = esday([2007, 0, 5]);
const endDate = esday([2007, 0, 10]);
endDate.to(startDate, true)
// Returns '5 days'
```
Overwrite threshold list:
```typescript
import { localePlugin, relativeTimePlugin } from 'esday/plugins'
import localeEn from 'esday/locales/en'

esday.extend(localePlugin)
esday.registerLocale(localeEn)
const options = {
  thresholds: [
    { key: 's', thresholdValue: 44, thresholdUnit: C.SECOND },
    { key: 'ss', thresholdValue: 43, thresholdUnit: C.SECOND },
    { key: 'm', thresholdValue: 89, thresholdUnit: C.SECOND },
    { key: 'mm', thresholdValue: 44, thresholdUnit: C.MIN },
    { key: 'h', thresholdValue: 89, thresholdUnit: C.MIN },
    { key: 'hh', thresholdValue: 21, thresholdUnit: C.HOUR },
    { key: 'd', thresholdValue: 1, thresholdUnit: C.DAY }, // modified threshold
    { key: 'dd', thresholdValue: 25, thresholdUnit: C.DAY },
    { key: 'M', thresholdValue: 45, thresholdUnit: C.DAY },
    { key: 'MM', thresholdValue: 10, thresholdUnit: C.MONTH },
    { key: 'y', thresholdValue: 17, thresholdUnit: C.MONTH },
    { key: 'yy', thresholdUnit: C.YEAR },
  ] as Threshold[],
}
esday.extend(relativeTimePlugin, options)
```
