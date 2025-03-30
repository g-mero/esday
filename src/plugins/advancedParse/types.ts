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

/**
 * Update property of 'this' with value from 'input'.
 * This function is used when defining the parsing tokens.
 */
export type UpdateParsedElement = (this: ParsedElements, input: string) => void
export type TokenDefinitions = Record<string, [RegExp, RegExp, UpdateParsedElement]>
