# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## 0.4.0 (2024-12-25)


### Features

* add locale plugin ([a6c6b81](https://github.com/g-mero/esday/commit/a6c6b81f518afc3c1753f2092208f506e57afb8c))
* add plugin utc ([b548412](https://github.com/g-mero/esday/commit/b5484123f9eceba122ab86d945b800ef4f3cf169))
* add type-check script and locale types ([88028d8](https://github.com/g-mero/esday/commit/88028d80c4c51401dea9dfff6b2a51ddbc206cad))


### Bug Fixes

* add missing input types to parseDate ([62e9a1e](https://github.com/g-mero/esday/commit/62e9a1e6bc20e77b3bd646af86286d1e3f24e4dc))
* api ([bc00fae](https://github.com/g-mero/esday/commit/bc00fae12648994e24c5719f6d4139c1ca37e2be))
* first day of week default value is 1 (Monday according to ISO 8601) ([eadbb5d](https://github.com/g-mero/esday/commit/eadbb5d1e2ebf689b472c3c1774bf0619604db62))
* local time offset cause test failed, remove expected unix time test ([721b320](https://github.com/g-mero/esday/commit/721b3203e1ef040227458c244ee05b5ec304db6c))
* make endOf method compatible with locale ([3a08fd5](https://github.com/g-mero/esday/commit/3a08fd5584a276f080ac9c19505735089bfdcf97))
* make format string optional (default: use default format) ([52f20bb](https://github.com/g-mero/esday/commit/52f20bb7ee4009c12aad38feaf6fccfb4200bed0))
* make parameters optional for isSame, isBefore, isAfter ([abda4f7](https://github.com/g-mero/esday/commit/abda4f76e460dad360a1c19bb340c00de6bbbbc0))
* make unit constants usable as unit parameters ([dec8b77](https://github.com/g-mero/esday/commit/dec8b775e867429455292e5f64c314c6151198e3))
* remove 'Z' from default format (depends on timezone) ([989671d](https://github.com/g-mero/esday/commit/989671ddaddfeb2879edef2bf8f8fb7c736bacc7))
* replace 'MS' with property of 'C' ([47f513d](https://github.com/g-mero/esday/commit/47f513dfa3f36e1d146bd66667b913582e7a41a2))
* require first parameter of isSame, isBefore, isAfter ([9b3ae36](https://github.com/g-mero/esday/commit/9b3ae362f87b11a220b41954b42e385f28aee2ba))
* use 'copy-cli' instead of script, copy README.md to dist ([3fb341c](https://github.com/g-mero/esday/commit/3fb341cdf87be9b17ca2c301adbabdd2eb7ea114))
* use ts-ignore instead of ts-expect-error which may cause build failure ([90d8092](https://github.com/g-mero/esday/commit/90d8092ffacdeaba5433db8c246420a915fbf153))
