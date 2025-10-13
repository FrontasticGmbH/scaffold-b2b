import { Account } from "../account";
import { Cart } from "./Cart";
import { RecurrencePolicySchedule } from "./RecurrencePolicy";

export type RecurringOrderState =
  | 'Active'
  | 'Canceled'
  | 'Expired'
  | 'Failed'
  | 'Paused';

export interface RecurringOrder {
  recurringOrderId: string;
  recurringOrderVersion?: number;
  key?: string;
  storeKey?: string;
  businessUnitKey?: string;
  recurringOrderState?: RecurringOrderState;
  schedule?: RecurrencePolicySchedule;
  cart?: Cart;
  account?: Account;
  originOrderId: string;
  startsAt?: string;
  nextOrderAt?: string;
  lastOrderAt?: string;
  resumesAt?: string;
  createdAt?: string;
}

