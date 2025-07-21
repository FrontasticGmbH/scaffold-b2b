import { Request } from '@frontastic/extension-types';
import { OrderQuery } from '@Types/query/OrderQuery';
import { SortAttributes, SortOrder } from '@Types/query/ProductQuery';
import queryParamsToIds from './requestHandlers/queryParamsToIds';
import queryParamsToStates from './requestHandlers/queryParamsToState';

export class OrderQueryFactory {
  static queryFromParams(request: Request): OrderQuery {
    const orderQuery: OrderQuery = {
      accountId: request.query?.accountId ?? undefined,
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      orderIds: queryParamsToIds('orderIds', request.query),
      orderNumbers: queryParamsToIds('orderNumbers', request.query),
      orderState: queryParamsToStates('orderStates', request.query),
      shipmentState: queryParamsToStates('shipmentStates', request.query),
      sortAttributes: OrderQueryFactory.queryParamsToSortAttributes(request.query),
      businessUnitKey: request.query?.businessUnitKey ?? undefined,
      created: {
        from: request.query?.createdFrom ? new Date(request.query?.createdFrom) : undefined,
        to: request.query?.createdTo ? new Date(request.query?.createdTo) : undefined,
      },
      query: request.query?.query ?? undefined,
    };

    return orderQuery;
  }

  private static queryParamsToSortAttributes(queryParams: { sortAttributes?: string }): SortAttributes {
    if (!queryParams.sortAttributes) {
      return {};
    }

    const sortAttributes: SortAttributes = {};
    const querySortAttributes = queryParams.sortAttributes;

    if (querySortAttributes) {
      let sortAttribute;

      for (sortAttribute of Object.values(querySortAttributes)) {
        const key = Object.keys(sortAttribute)[0];
        sortAttributes[key] = sortAttribute[key] ? sortAttribute[key] : SortOrder.ASCENDING;
      }
    }

    return sortAttributes;
  }
}
