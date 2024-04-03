export enum FilterTypes {
  BOOLEAN = 'boolean',
  ENUM = 'enum',
  TERM = 'term',
  RANGE = 'range',
}

export interface Filter {
  type: FilterTypes.BOOLEAN | FilterTypes.ENUM | FilterTypes.RANGE | FilterTypes.TERM;
  identifier: string;
}
