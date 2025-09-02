import { Request } from '@frontastic/extension-types';
import { RecurringOrderQuery } from '@Types/query';
import { SortAttributes, SortOrder } from '@Types/query/ProductQuery';
import queryParamsToIds from './requestHandlers/queryParamsToIds';
import queryParamsToStates from './requestHandlers/queryParamsToState';
import { getBusinessUnitKey } from './requestHandlers/Request';

export class RecurringOrderFactory {
  static queryFromParams(request: Request): RecurringOrderQuery {
    const recurringOrderQuery: RecurringOrderQuery = {
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      recurringOrderIds: queryParamsToIds('recurringOrderIds', request.query),
      recurringOrderStates: queryParamsToStates('recurringOrderStates', request.query),
      businessUnitKey: getBusinessUnitKey(request),
      startsAt: request.query?.startsAt ?? undefined,
      createdAt: request.query?.createdAt ?? undefined,
      sortAttributes: RecurringOrderFactory.queryParamsToSortAttributes(request.query),
    };

    return recurringOrderQuery;
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
