import crypto from 'crypto';
import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { Account } from '@Types/account/Account';
import { Address } from '@Types/account/Address';
import { BusinessUnit } from '@Types/business-unit/BusinessUnit';
import { ApprovalRule } from '@Types/business-unit';
import { ApprovalRuleQuery } from '@Types/business-unit/ApprovalRule';
import { ApprovalFlowsQuery } from '@Types/business-unit/ApprovalFlow';
import { OrderQuery } from '@Types/query/OrderQuery';
import { OrderState } from '@Types/cart/Order';
import { getBusinessUnitKey, getLocale, getStoreKey } from '../utils/requestHandlers/Request';
import handleError from '@Commerce-commercetools/utils/handleError';
import { EmailApiFactory } from '@Commerce-commercetools/utils/EmailApiFactory';
import parseRequestBody from '@Commerce-commercetools/utils/requestHandlers/parseRequestBody';
import getCartApi from '@Commerce-commercetools/utils/apiFactories/getCartApi';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';
import getAccountApi from '@Commerce-commercetools/utils/apiFactories/getAccountApi';
import getBusinessUnitApi from '@Commerce-commercetools/utils/apiFactories/getBusinessUnitApi';
import queryParamsToStates from '@Commerce-commercetools/utils/requestHandlers/queryParamsToState';
import queryParamsToIds from '@Commerce-commercetools/utils/requestHandlers/queryParamsToIds';
import queryParamsToSortAttributes from '@Commerce-commercetools/utils/requestHandlers/queryParamsToSortAttributes';
import { AccountFetcher } from '@Commerce-commercetools/utils/AccountFetcher';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export interface BusinessUnitRequestBody {
  account: Account;
  parentBusinessUnit?: string;
  name?: string;
  contactEmail?: string;
}

export const getBusinessUnits: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const expandStores = request.query?.['expandStores'] === 'true';

    const businessUnits = await businessUnitApi.getBusinessUnitsForUser(accountId, expandStores);

    return {
      statusCode: 200,
      body: JSON.stringify(businessUnits),
      sessionData: {
        ...request.sessionData,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const getBusinessUnitOrders: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);
    const businessUnitKey = getBusinessUnitKey(request);

    if (!businessUnitKey) {
      throw new ValidationError({ message: 'No business unit key' });
    }

    const orderQuery: OrderQuery = {
      businessUnitKey: businessUnitKey,
    };

    const orders = await cartApi.queryOrders(orderQuery);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(orders),
      sessionData: request.sessionData,
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const create: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const businessUnitRequestBody: BusinessUnitRequestBody = JSON.parse(request.body);

    const businessUnit = await businessUnitApi.createForAccount(accountId, businessUnitRequestBody.account);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(businessUnit),
      sessionData: request.sessionData,
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const addAssociate: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const businessUnitKey = request.query['businessUnitKey'];
    const locale = getLocale(request);
    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);
    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);
    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    let businessUnit = await businessUnitApi.getByKeyForAccount(businessUnitKey, accountId);

    if (!businessUnit) {
      throw new ResourceNotFoundError({ message: `Business unit "${businessUnitKey}" not found.` });
    }

    const addAssociateBody: { email: string; roleKeys: string[] } = JSON.parse(request.body);
    let accountAssociate = await accountApi.getAccountByEmail(addAssociateBody.email);

    if (!accountAssociate) {
      const accountData = {
        email: addAssociateBody.email,
        password: crypto.randomBytes(6).toString('base64').slice(0, 8),
        companyName: businessUnit.name,
      };

      accountAssociate = await accountApi.create(accountData);
      const passwordResetToken = await accountApi.generatePasswordResetToken(accountAssociate.email);
      emailApi.sendAssociateVerificationAndPasswordResetEmail(accountAssociate, passwordResetToken);
    }

    businessUnit = await businessUnitApi.addAssociate(
      businessUnitKey,
      accountId,
      accountAssociate.accountId,
      addAssociateBody.roleKeys,
    );

    emailApi.sendWelcomeAssociateEmail(accountAssociate, businessUnit);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(businessUnit),
      sessionData: request.sessionData,
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const removeAssociate: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const { accountId: associateAccountId } = JSON.parse(request.body);
    const businessUnitKey = request.query['businessUnitKey'];
    const businessUnit = await businessUnitApi.removeAssociate(businessUnitKey, accountId, associateAccountId);

    return {
      statusCode: 200,
      body: JSON.stringify(businessUnit),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateAssociate: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const { accountId: associateId, roleKeys }: { accountId: string; roleKeys: string[] } = JSON.parse(request.body);
    const businessUnitKey = request.query['businessUnitKey'];

    const businessUnit = await businessUnitApi.updateAssociate(businessUnitKey, accountId, associateId, roleKeys);

    return {
      statusCode: 200,
      body: JSON.stringify(businessUnit),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateBusinessUnit: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const requestData = parseRequestBody<BusinessUnitRequestBody>(request.body);

    const businessUnitRequestData: BusinessUnit = {
      ...requestData,
      contactEmail: requestData.contactEmail,
      name: requestData.name,
      key: request.query['businessUnitKey'],
    };

    const businessUnit = await businessUnitApi.updateBusinessUnit(businessUnitRequestData, accountId);

    return {
      statusCode: 200,
      body: JSON.stringify(businessUnit),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const addBusinessUnitAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const { address } = parseRequestBody<{ address: Address }>(request.body);

    const businessUnitKey = request.query['businessUnitKey'];

    const businessUnit = await businessUnitApi.addBusinessUnitAddress(businessUnitKey, accountId, address);

    return {
      statusCode: 200,
      body: JSON.stringify(businessUnit),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateBusinessUnitAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const { address } = parseRequestBody<{ address: Address }>(request.body);

    const businessUnitKey = request.query['businessUnitKey'];

    const businessUnit = await businessUnitApi.updateBusinessUnitAddress(businessUnitKey, accountId, address);

    return {
      statusCode: 200,
      body: JSON.stringify(businessUnit),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const removeBusinessUnitAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const requestData = parseRequestBody<{ addressId: string }>(request.body);
    const addressId = requestData.addressId;

    const businessUnitKey = request.query['businessUnitKey'];

    const businessUnit = await businessUnitApi.removeBusinessUnitAddress(businessUnitKey, accountId, addressId);

    return {
      statusCode: 200,
      body: JSON.stringify(businessUnit),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const getBusinessUnit: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const businessUnitKey = request.query?.['businessUnitKey'];

    const businessUnit = await businessUnitApi.getByKeyForAccount(businessUnitKey, accountId, true);

    return {
      statusCode: 200,
      body: JSON.stringify(businessUnit),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const getAssociateRoles: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);
    const associateRoles = await businessUnitApi.getAssociateRoles();

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(associateRoles),
      sessionData: request.sessionData,
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const setBusinessUnitAndStoreKeys: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const storeKey = getStoreKey(request);

    if (!businessUnitKey || !storeKey) {
      throw new ValidationError({ message: 'Business unit or store key is missing.' });
    }

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const businessUnit = await businessUnitApi.getByKeyForAccount(businessUnitKey, accountId, true);

    const store = businessUnit.stores?.find((store) => store.key === storeKey);

    if (!store) {
      throw new ResourceNotFoundError({
        message: `Business Unit "${businessUnitKey}" is not linked to the store "${storeKey}"`,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({}),
      sessionData: {
        ...request.sessionData,
        businessUnitKey,
        storeKey,
        distributionChannelId: store?.distributionChannels?.[0]?.channelId, // Use only the first distribution channel
        supplyChannelId: store?.supplyChannels?.[0]?.channelId, // Use only the first supply channel
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const getAssociate: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const businessUnitKey = getBusinessUnitKey(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const account = await accountApi.getById(accountId);

    const associate = await businessUnitApi.getAssociate(businessUnitKey, account);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(associate),
      sessionData: {
        ...request.sessionData,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const createApprovalRule: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const businessUnitKey = getBusinessUnitKey(request);
    const storeKey = getStoreKey(request);

    const approvalRuleRequest = parseRequestBody<{ approvalRule: ApprovalRule }>(request.body);

    if (!businessUnitKey || !storeKey) {
      throw new ValidationError({ message: 'Business unit or store key is missing.' });
    }

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const approvalRule = await businessUnitApi.createApprovalRule(
      accountId,
      businessUnitKey,
      approvalRuleRequest.approvalRule,
    );

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(approvalRule),
      sessionData: request.sessionData,
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const queryApprovalRules: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const approvalRuleQuery: ApprovalRuleQuery = {
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      approvalRuleStatus: queryParamsToStates('approvalRuleStatus', request.query),
      sortAttributes: queryParamsToSortAttributes(request.query),
      approvalRuleIds: queryParamsToIds('approvalRuleIds', request.query),
    };

    const queryResult = await businessUnitApi.queryApprovalRules(businessUnitKey, accountId, approvalRuleQuery);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(queryResult),
      sessionData: {
        ...request.sessionData,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateApprovalRule: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);
    const businessUnitKey = getBusinessUnitKey(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const approvalRuleRequest = parseRequestBody<{ approvalRule: Omit<ApprovalRule, 'approvalRuleVersion'> }>(
      request.body,
    );

    const approvalRule = await businessUnitApi.updateApprovalRule(
      approvalRuleRequest.approvalRule,
      accountId,
      businessUnitKey,
    );

    return {
      statusCode: 200,
      body: JSON.stringify(approvalRule),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const queryApprovalFlows: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const approvalFlowsQuery: ApprovalFlowsQuery = {
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      sortAttributes: queryParamsToSortAttributes(request.query),
      approvalFlowStatus: queryParamsToStates('approvalFlowStatus', request.query),
      approvalFlowIds: queryParamsToIds('approvalFlowIds', request.query),
    };

    const approvalRules = await businessUnitApi.queryApprovalFlows(businessUnitKey, accountId, approvalFlowsQuery);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(approvalRules),
      sessionData: {
        ...request.sessionData,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const approveApprovalFlow: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);
    const businessUnitKey = getBusinessUnitKey(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const { approvalFlowId } = parseRequestBody<{ approvalFlowId: string }>(request.body);

    const approvalFlow = await businessUnitApi.approveApprovalFlow(businessUnitKey, accountId, approvalFlowId);

    return {
      statusCode: 200,
      body: JSON.stringify(approvalFlow),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const rejectApprovalFlow: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const { approvalFlowId, reason } = parseRequestBody<{ approvalFlowId: string; reason?: string }>(request.body);

    const approvalFlow = await businessUnitApi.rejectApprovalFlow(businessUnitKey, accountId, approvalFlowId, reason);

    const order = await cartApi.updateOrderState(approvalFlow.order.orderId, OrderState.Cancelled);

    approvalFlow.order = order;

    return {
      statusCode: 200,
      body: JSON.stringify(approvalFlow),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};
