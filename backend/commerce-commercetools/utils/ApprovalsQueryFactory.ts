import { DataSourceConfiguration, Request } from '@frontastic/extension-types';
import { SortAttributes, SortOrder } from '@Types/query/ProductQuery';
import { ApprovalFlowsQuery, ApprovalRuleQuery } from '@Types/business-unit';

export default class ApprovalsQueryFactory {
  static queryFromParams(
    request: Request,
    approvalKey: 'approvalRuleIds' | 'approvalFlowIds',
    config?: DataSourceConfiguration,
  ): ApprovalRuleQuery | ApprovalFlowsQuery {
    const queryParams = { ...request?.query };
    const approvalQuery: ApprovalRuleQuery | ApprovalFlowsQuery = {
      [approvalKey]: [],
    };

    // Overwrite queryParams with configuration from Studio
    if (config?.configuration) {
      Object.entries(config.configuration).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (key === approvalKey) {
            queryParams[approvalKey] = (value as string).split(',').map((val: string) => val.trim());
          } else {
            queryParams[key] = value;
          }
        }
      });
    }

    /**
     * Map approvalRuleIds or approvalFlowIds
     */
    if (queryParams[approvalKey] && Array.isArray(queryParams[approvalKey])) {
      approvalQuery[approvalKey] = queryParams[approvalKey].map((id: string | number) => id.toString());
    }

    /**
     * Map sort attributes
     */
    if (queryParams.sortAttributes) {
      const sortAttributes: SortAttributes = {};
      for (const sortAttribute of Object.values(queryParams.sortAttributes)) {
        if (typeof sortAttribute === 'object' && !Array.isArray(sortAttribute)) {
          const key = Object.keys(sortAttribute)[0];
          sortAttributes[key] = sortAttribute[key] || SortOrder.ASCENDING;
        }
      }
      approvalQuery.sortAttributes = sortAttributes;
    }

    /**
     * Map page limit
     */
    approvalQuery.limit = queryParams?.limit;

    /**
     * Map page cursor
     */
    approvalQuery.cursor = queryParams?.cursor;

    return approvalQuery;
  }
}
