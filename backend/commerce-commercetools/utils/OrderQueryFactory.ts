import { Request } from '@frontastic/extension-types';
import { OrderQuery } from '@Types/query/OrderQuery';
import { SortAttributes, SortOrder } from '@Types/query/ProductQuery';
import { Account } from '@Types/account/Account';
import queryParamsToIds from './requestHandlers/queryParamsToIds';
import queryParamsToStates from './requestHandlers/queryParamsToState';

export class OrderQueryFactory {
  static queryFromParams: (request: Request, account?: Account) => OrderQuery = (
    request: Request,
    account?: Account,
  ) => {
    const orderQuery: OrderQuery = {
      accountId: account?.accountId,
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
  };

  private static queryParamsToSortAttributes(queryParams: any) {
    const sortAttributes: SortAttributes = {};

    if (queryParams.sortAttributes) {
      let sortAttribute;

      for (sortAttribute of Object.values(queryParams.sortAttributes)) {
        const key = Object.keys(sortAttribute)[0];
        sortAttributes[key] = sortAttribute[key] ? sortAttribute[key] : SortOrder.ASCENDING;
      }
    }

    return sortAttributes;
  }
}
