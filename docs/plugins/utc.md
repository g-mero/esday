# Utc

Utc adds methods to EsDay and esday to dates as UTC.

## Method signatures
Methods added to EsDay instances:
```typescript
esday().utc: (keepLocalTime?: boolean): EsDay
local(): EsDay
isUTC(): boolean
utcOffset(): number
utcOffset(offset: number | string, keepLocalTime?: boolean): EsDay
```

Methods added to esday:
```typescript
utc(date: DateType): EsDay
```

| method                   | description                                                 |
| ------------------------ | ----------------------------------------------------------- |
| esday().utc()                 | convert an EsDay instance to utc                            |
| esday().utc(true)             | convert an EsDay instance to utc, without changing the time |
| esday().local()               | convert an EsDay instance from utc to local timezone        |
| esday().isUTC()               | is EsDay instance in utc mode?                              |
| esday().utcOffset()           | get offset to utc for EsDay instance in minutes             |
| esday().utcOffset(240)        | set offset to utc for EsDay instance to 240 minutes         |
| esday().utcOffset(-120, true) | set offset to utc for EsDay instance to -120 minutes,       |
|                               |   keeping the local time, but choosing a different point    |
|                               |   in Universal Time.                                        |

If the first parameter of utcOffset is less than 16 and greater than -16, it will be interpreted as hours instead of minutes.

utcOffset will take a string as input value; esday will search the string for the last match of +00 -00 +00:00 +0000 -00:00 -0000 Z, so you can even pass an ISO8601 formatted string to offset and esday will set that UTC offset. If the string does not include 'Z', it must include the + or - character.
