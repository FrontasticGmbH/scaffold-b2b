import { Context, Request } from '@frontastic/extension-types';
import { ApprovalFlow, ApprovalFlowsQuery, ApprovalRule, ApprovalRuleQuery } from '@Types/business-unit';
import { PaginatedResult } from '@Types/result';
import getBusinessUnitApi from '../apiConstructors/getBusinessUnitApi';
import queryParamsToIds from '@Commerce-commercetools/utils/requestHandlers/queryParamsToIds';
import queryParamsToStates from '@Commerce-commercetools/utils/requestHandlers/queryParamsToState';
import { assertIsAuthenticated } from '@Commerce-commercetools/utils/assertIsAuthenticated';
import { getBusinessUnitKey } from '@Commerce-commercetools/utils/requestHandlers/Request';
import queryParamsToSortAttributes from '@Commerce-commercetools/utils/requestHandlers/queryParamsToSortAttributes';
import getPathParametersWithRegex from '@Commerce-commercetools/utils/requestHandlers/getPathParametersWithRegex';

const approvalFlowRegex = /\/approval-flow\/([^\/]+)/;
const approvalRuleRegex = /\/approval-rule\/([^\/]+)/;
const approvalFlowsRegex = /\/approval-flows/;
const approvalRulesRegex = /\/approval-rules/;

export default class ApprovalRouter {
  static identifyApprovalFlowFrom(request: Request): boolean {
    return !!getPathParametersWithRegex(request, approvalFlowRegex);
  }

  static identifyApprovalRuleFrom(request: Request): boolean {
    return !!getPathParametersWithRegex(request, approvalRuleRegex);
  }

  static identifyApprovalFlowsFrom(request: Request): boolean {
    return !!getPathParametersWithRegex(request, approvalFlowsRegex);
  }

  static identifyApprovalRulesFrom(request: Request): boolean {
    return !!getPathParametersWithRegex(request, approvalRulesRegex);
  }

  static loadApprovalFlowFor = async (
    request: Request,
    commercetoolsFrontendContext: Context,
  ): Promise<ApprovalFlow> => {
    const account = assertIsAuthenticated(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const businessUnitApi = getBusinessUnitApi(request, commercetoolsFrontendContext);

    const urlMatches = getPathParametersWithRegex(request, approvalFlowRegex);

    if (urlMatches) {
      const approvalFlowQuery = this.buildApprovalFlowsQuery(request);
      approvalFlowQuery.approvalFlowIds = [urlMatches[1]];

      const response = await businessUnitApi.queryApprovalFlows(businessUnitKey, account.accountId, approvalFlowQuery);

      return response.items[0];
    }

    return null;
  };

  static loadApprovalRuleFor = async (
    request: Request,
    commercetoolsFrontendContext: Context,
  ): Promise<ApprovalRule> => {
    const account = assertIsAuthenticated(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const businessUnitApi = getBusinessUnitApi(request, commercetoolsFrontendContext);

    const urlMatches = getPathParametersWithRegex(request, approvalRuleRegex);

    if (urlMatches) {
      const query = this.buildApprovalRulesQuery(request);
      query.approvalRuleIds = [urlMatches[1]];

      const response = await businessUnitApi.queryApprovalRules(businessUnitKey, account.accountId, query);

      return response.items[0];
    }

    return null;
  };

  static loadApprovalFlowsFor = async (
    request: Request,
    commercetoolsFrontendContext: Context,
  ): Promise<PaginatedResult<ApprovalFlow>> => {
    const account = assertIsAuthenticated(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const businessUnitApi = getBusinessUnitApi(request, commercetoolsFrontendContext);

    const urlMatches = getPathParametersWithRegex(request, approvalFlowsRegex);

    if (urlMatches) {
      const approvalFlowQuery = this.buildApprovalFlowsQuery(request);

      return await businessUnitApi.queryApprovalFlows(businessUnitKey, account.accountId, approvalFlowQuery);
    }

    return null;
  };

  static loadApprovalRulesFor = async (
    request: Request,
    commercetoolsFrontendContext: Context,
  ): Promise<PaginatedResult<ApprovalRule>> => {
    const account = assertIsAuthenticated(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const businessUnitApi = getBusinessUnitApi(request, commercetoolsFrontendContext);

    const urlMatches = getPathParametersWithRegex(request, approvalRulesRegex);

    if (urlMatches) {
      const approvalRuleQuery = this.buildApprovalRulesQuery(request);

      return await businessUnitApi.queryApprovalRules(businessUnitKey, account.accountId, approvalRuleQuery);
    }

    return null;
  };

  private static buildApprovalFlowsQuery(request: Request): ApprovalFlowsQuery {
    return {
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      approvalFlowStatus: queryParamsToStates('approvalFlowStatus', request.query),
      approvalFlowIds: queryParamsToIds('approvalFlowIds', request.query),
      sortAttributes: queryParamsToSortAttributes(request.query),
    };
  }

  private static buildApprovalRulesQuery(request: Request): ApprovalRuleQuery {
    return {
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      approvalRuleStatus: queryParamsToStates('approvalRuleStatus', request.query),
      approvalRuleIds: queryParamsToIds('approvalRuleIds', request.query),
      sortAttributes: queryParamsToSortAttributes(request.query),
    };
  }
}
