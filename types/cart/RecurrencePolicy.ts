export type IntervalUnit = 'Days' | 'Months' | 'Weeks';

interface StandardSchedule {
  type: 'standard';
  value: number;
  intervalUnit: IntervalUnit;
}

interface DayOfMonthSchedule {
  type: 'dayOfMonth';
  day: number;
}

export enum PriceSelectionMode {
  Fixed = 'Fixed',
  Dynamic = 'Dynamic',
}

export type RecurrencePolicySchedule = StandardSchedule | DayOfMonthSchedule;

export interface RecurrencePolicy {
  recurrencePolicyId?: string;
  name?: string;
  key?: string;
  description?: string;
  schedule?: RecurrencePolicySchedule;
}

export interface LineItemRecurrenceInfo {
  recurrencePolicy?: RecurrencePolicy;
  priceSelectionMode?: PriceSelectionMode;
}