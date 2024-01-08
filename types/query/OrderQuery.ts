import { PaginatedQuery, SortAttributes } from '../query';
import { OrderState, ReturnShipmentState, ShipmentState } from '../cart';

export interface OrderQuery extends PaginatedQuery {
  accountId?: string;
  orderIds?: string[];
  orderNumbers?: string[];
  orderState?: OrderState[];
  sortAttributes?: SortAttributes;
  businessUnitKey?: string;
  shipmentState?: ShipmentState[];
  returnShipmentState?: ReturnShipmentState[];
  created?: {
    from?: Date;
    to?: Date;
  };
}
