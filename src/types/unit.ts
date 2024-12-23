export type PrettyUnitType = 'date' | 'day' | 'week' | 'month' | 'year'
  | 'hour' | 'minute' | 'second' | 'millisecond'
export type PrettyUnit<T extends UnitType> = T extends 'D' ? 'date' :
  T extends 'w' ? 'week' : T extends 'M' ? 'month' : T extends 'y' ? 'year' :
    T extends 'h' ? 'hour' : T extends 'm' ? 'minute' : T extends 's' ? 'second' :
      T extends 'ms' ? 'millisecond' : T extends 'd' ? 'day' : T

export type UnitType = 'y' | 'M' | 'D' | 'w' | 'h' | 'm' | 's' | 'ms' | 'd' | PrettyUnitType
