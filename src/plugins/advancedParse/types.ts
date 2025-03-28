declare module 'esday' {
  interface EsDayFactory {
    /**
     * add new definitions for parsing tokens
     */
    addParseTokenDefinitions: (newTokens: TokenDefinitions) => void
  }
}

export interface ParsedElements {
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

export type TokenDefinitions = Record<
  string,
  [RegExp, RegExp, (this: ParsedElements, input: string) => void]
>
