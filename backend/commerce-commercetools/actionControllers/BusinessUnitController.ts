import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { Account } from '@Types/account/Account';
import { Address } from '@Types/account/Address';
import { BusinessUnit } from '@Types/business-unit/BusinessUnit';
import { ApprovalRule } from '@Types/business-unit';
import { ApprovalRuleQuery } from '@Types/business-unit/ApprovalRule';
import { ApprovalFlowsQuery } from '@Types/business-unit/ApprovalFlow';
import { getBusinessUnitKey, getLocale, getStoreKey } from '../utils/requestHandlers/Request';
import { fetchAccountFromSession } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import handleError from '@Commerce-commercetools/utils/handleError';
import { EmailApiFactory } from '@Commerce-commercetools/utils/EmailApiFactory';
import parseRequestBody from '@Commerce-commercetools/utils/requestHandlers/parseRequestBody';
import getCartApi from '@Commerce-commercetools/utils/apiConstructors/getCartApi';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';
import { assertIsAuthenticated } from '@Commerce-commercetools/utils/assertIsAuthenticated';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';
import getAccountApi from '@Commerce-commercetools/utils/apiConstructors/getAccountApi';
import getBusinessUnitApi from '@Commerce-commercetools/utils/apiConstructors/getBusinessUnitApi';
import queryParamsToStates from '@Commerce-commercetools/utils/requestHandlers/queryParamsToState';
import queryParamsToIds from '@Commerce-commercetools/utils/requestHandlers/queryParamsToIds';
import queryParamsToSortAttributes from '@Commerce-commercetools/utils/requestHandlers/queryParamsToSortAttributes';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export interface BusinessUnitRequestBody {
  account: Account;
  parentBusinessUnit?: string;
  name?: string;
  contactEmail?: string;
}

export const getBusinessUnits: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    assertIsAuthenticated(request);

    const account = fetchAccountFromSession(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const expandStores = request.query?.['expandStores'] === 'true';

    const businessUnits = await businessUnitApi.getBusinessUnitsForUser(account.accountId, expandStores);

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
    const businessUnitKey = request?.query?.['businessUnitKey'];

    if (!businessUnitKey) {
      throw new ValidationError({ message: 'No business unit key' });
    }
    const orders = await cartApi.getBusinessUnitOrders();

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
    assertIsAuthenticated(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const businessUnitRequestBody: BusinessUnitRequestBody = JSON.parse(request.body);

    const businessUnit = await businessUnitApi.createForAccount(businessUnitRequestBody.account);

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
    assertIsAuthenticated(request);

    const account = fetchAccountFromSession(request);

    const locale = getLocale(request);
    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);
    const addUserBody: { email: string; roleKeys: string[] } = JSON.parse(request.body);

    let accountAssociate = await accountApi.getAccountByEmail(addUserBody.email);

    if (!accountAssociate) {
      const accountData = {
        email: addUserBody.email,
        password: Math.random().toString(36).slice(-8),
      };
      accountAssociate = await accountApi.create(accountData);

      const passwordResetToken = await accountApi.generatePasswordResetToken(accountAssociate.email);
      emailApi.sendAssociateVerificationAndPasswordResetEmail(accountAssociate, passwordResetToken);
    }

    const businessUnitKey = request.query['businessUnitKey'];

    const businessUnit = await businessUnitApi.addAssociate(
      businessUnitKey,
      account.accountId,
      accountAssociate.accountId,
      addUserBody.roleKeys,
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
    assertIsAuthenticated(request);

    const account = fetchAccountFromSession(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const { accountId: associateAccountId } = JSON.parse(request.body);
    const businessUnitKey = request.query['businessUnitKey'];
    const businessUnit = await businessUnitApi.removeAssociate(businessUnitKey, account.accountId, associateAccountId);

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
    assertIsAuthenticated(request);

    const account = fetchAccountFromSession(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const { accountId: associateId, roleKeys }: { accountId: string; roleKeys: string[] } = JSON.parse(request.body);
    const businessUnitKey = request.query['businessUnitKey'];

    const businessUnit = await businessUnitApi.updateAssociate(
      businessUnitKey,
      account.accountId,
      associateId,
      roleKeys,
    );

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
    assertIsAuthenticated(request);

    const account = fetchAccountFromSession(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const requestData = parseRequestBody<BusinessUnitRequestBody>(request.body);

    const businessUnitRequestData: BusinessUnit = {
      ...requestData,
      contactEmail: requestData.contactEmail,
      name: requestData.name,
      key: request.query['businessUnitKey'],
    };

    const businessUnit = await businessUnitApi.updateBusinessUnit(businessUnitRequestData, account.accountId);

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
    assertIsAuthenticated(request);

    const account = fetchAccountFromSession(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const { address } = parseRequestBody<{ address: Address }>(request.body);

    const businessUnitKey = request.query['businessUnitKey'];

    const businessUnit = await businessUnitApi.addBusinessUnitAddress(businessUnitKey, account.accountId, address);

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
    assertIsAuthenticated(request);

    const account = fetchAccountFromSession(request);
    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const { address } = parseRequestBody<{ address: Address }>(request.body);

    const businessUnitKey = request.query['businessUnitKey'];

    const businessUnit = await businessUnitApi.updateBusinessUnitAddress(businessUnitKey, account.accountId, address);

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
    assertIsAuthenticated(request);

    const account = fetchAccountFromSession(request);
    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const requestData = parseRequestBody<{ addressId: string }>(request.body);
    const addressId = requestData.addressId;

    const businessUnitKey = request.query['businessUnitKey'];

    const businessUnit = await businessUnitApi.removeBusinessUnitAddress(businessUnitKey, account.accountId, addressId);

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
    assertIsAuthenticated(request);

    const account = fetchAccountFromSession(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const businessUnitKey = request.query?.['businessUnitKey'];

    const businessUnit = await businessUnitApi.getByKeyForAccount(businessUnitKey, account.accountId, true);

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
    assertIsAuthenticated(request);

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
    assertIsAuthenticated(request);

    const account = fetchAccountFromSession(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const storeKey = getStoreKey(request);

    if (!businessUnitKey || !storeKey) {
      throw new ValidationError({ message: 'Business unit or store key is missing.' });
    }

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const businessUnit = await businessUnitApi.getByKeyForAccount(businessUnitKey, account.accountId, true);

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
        storeId: store.storeId,
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
    assertIsAuthenticated(request);

    const account = fetchAccountFromSession(request);
    const businessUnitKey = getBusinessUnitKey(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const associate = await businessUnitApi.getAssociate(businessUnitKey, account.accountId);

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
    assertIsAuthenticated(request);

    const account = fetchAccountFromSession(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const storeKey = getStoreKey(request);

    const approvalRuleRequest = parseRequestBody<{ approvalRule: ApprovalRule }>(request.body);

    if (!businessUnitKey || !storeKey) {
      throw new ValidationError({ message: 'Business unit or store key is missing.' });
    }

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const approvalRule = await businessUnitApi.createApprovalRule(
      account.accountId,
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
    const account = assertIsAuthenticated(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const approvalRuleQuery: ApprovalRuleQuery = {
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      approvalRuleStatus: queryParamsToStates('approvalRuleStatus', request.query),
      sortAttributes: queryParamsToSortAttributes(request.query),
      approvalRuleIds: queryParamsToIds('approvalRuleIds', request.query),
    };

    const queryResult = await businessUnitApi.queryApprovalRules(businessUnitKey, account.accountId, approvalRuleQuery);

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
    const account = assertIsAuthenticated(request);
    const businessUnitKey = getBusinessUnitKey(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const approvalRuleRequest = parseRequestBody<{ approvalRule: Omit<ApprovalRule, 'approvalRuleVersion'> }>(
      request.body,
    );

    const approvalRule = await businessUnitApi.updateApprovalRule(
      approvalRuleRequest.approvalRule,
      account.accountId,
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
    const account = assertIsAuthenticated(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const approvalFlowsQuery: ApprovalFlowsQuery = {
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      sortAttributes: queryParamsToSortAttributes(request.query),
      approvalFlowStatus: queryParamsToStates('approvalFlowStatus', request.query),
      approvalFlowIds: queryParamsToIds('approvalFlowIds', request.query),
    };

    const approvalRules = await businessUnitApi.queryApprovalFlows(
      businessUnitKey,
      account.accountId,
      approvalFlowsQuery,
    );

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
    const account = assertIsAuthenticated(request);
    const businessUnitKey = getBusinessUnitKey(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const { approvalFlowId } = parseRequestBody<{ approvalFlowId: string }>(request.body);

    const approvalFlow = await businessUnitApi.approveApprovalFlow(businessUnitKey, account.accountId, approvalFlowId);

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
    const account = assertIsAuthenticated(request);
    const businessUnitKey = getBusinessUnitKey(request);

    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    const { approvalFlowId, reason } = parseRequestBody<{ approvalFlowId: string; reason?: string }>(request.body);

    const approvalFlow = await businessUnitApi.rejectApprovalFlow(
      businessUnitKey,
      account.accountId,
      approvalFlowId,
      reason,
    );

    return {
      statusCode: 200,
      body: JSON.stringify(approvalFlow),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};
