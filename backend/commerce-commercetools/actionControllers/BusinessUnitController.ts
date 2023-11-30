import { AccountApi } from '@Commerce-commercetools/apis/AccountApi';

import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { Store } from '@Types/store/Store';
import { getCurrency, getLocale } from '../utils/Request';
import { BusinessUnitApi } from '../apis/BusinessUnitApi';
import { CartApi } from '../apis/CartApi';
import { fetchAccountFromSession } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import { AccountAuthenticationError } from '@Commerce-commercetools/errors/AccountAuthenticationError';
import { Account } from '@Types/account/Account';
import handleError from '@Commerce-commercetools/utils/handleError';
import { EmailApiFactory } from '@Commerce-commercetools/utils/EmailApiFactory';
import { BaseAccountMapper } from '@Commerce-commercetools/mappers/BaseAccountMapper';
import parseRequestBody from '@Commerce-commercetools/utils/parseRequestBody';
import { Address } from '@Types/account/Address';
import { BusinessUnit } from '@Types/business-unit/BusinessUnit';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export interface BusinessUnitRequestBody {
  account: Account;
  store?: Store;
  parentBusinessUnit?: string;
  name?: string;
  contactEmail?: string;
}

export const getBusinessUnits: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const account = fetchAccountFromSession(request);

  if (account === undefined) {
    throw new AccountAuthenticationError({ message: 'Not logged in.' });
  }

  const businessUnitApi = new BusinessUnitApi(
    actionContext.frontasticContext,
    getLocale(request),
    getCurrency(request),
  );

  const expandStores = request.query?.['expandStores'] === 'true';

  const businessUnits = await businessUnitApi.getBusinessUnitsForUser(account, expandStores);

  return {
    statusCode: 200,
    body: JSON.stringify(businessUnits),
    sessionData: {
      ...request.sessionData,
    },
  };
};

export const getBusinessUnitOrders: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const account = fetchAccountFromSession(request);

  if (account === undefined) {
    throw new AccountAuthenticationError({ message: 'Not logged in.' });
  }

  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  const key = request?.query?.['key'];
  if (!key) {
    throw new Error('No key');
  }

  const orders = await cartApi.getBusinessUnitOrders(key, account);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(orders),
    sessionData: request.sessionData,
  };

  return response;
};

export const create: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const businessUnitApi = new BusinessUnitApi(
    actionContext.frontasticContext,
    getLocale(request),
    getCurrency(request),
  );
  const businessUnitRequestBody: BusinessUnitRequestBody = JSON.parse(request.body);

  const account = fetchAccountFromSession(request);
  if (account === undefined) {
    throw new AccountAuthenticationError({ message: 'Not logged in.' });
  }

  const businessUnit = await businessUnitApi.createForAccountAndStore(
    businessUnitRequestBody.account,
    businessUnitRequestBody.store,
  );

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(businessUnit),
    sessionData: request.sessionData,
  };

  return response;
};

export const addAssociate: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const locale = getLocale(request);
  const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);

  const businessUnitApi = new BusinessUnitApi(
    actionContext.frontasticContext,
    getLocale(request),
    getCurrency(request),
  );
  const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
  const addUserBody: { email: string; roleKeys: string[] } = JSON.parse(request.body);

  let account = await accountApi.getAccountByEmail(addUserBody.email);
  if (!account) {
    const accountData = {
      email: addUserBody.email,
      password: Math.random().toString(36).slice(-8),
    };
    account = await accountApi.create(accountData);

    const passwordResetToken = await accountApi.generatePasswordResetToken(account.email);
    emailApi.sendAccountVerificationAndPasswordResetEmail(account, passwordResetToken);
  }

  const businessUnit = await businessUnitApi.addAssociate(
    request.query['key'],
    account.accountId,
    addUserBody.roleKeys,
  );

  emailApi.sendWelcomeAssociateEmail(account, businessUnit);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(businessUnit),
    sessionData: request.sessionData,
  };

  return response;
};

export const removeAssociate: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const businessUnitApi = new BusinessUnitApi(
    actionContext.frontasticContext,
    getLocale(request),
    getCurrency(request),
  );

  const { accountId } = JSON.parse(request.body);
  try {
    const businessUnit = await businessUnitApi.removeAssociate(request.query['key'], accountId);

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
  const businessUnitApi = new BusinessUnitApi(
    actionContext.frontasticContext,
    getLocale(request),
    getCurrency(request),
  );

  const { accountId, roleKeys }: { accountId: string; roleKeys: string[] } = JSON.parse(request.body);
  try {
    const businessUnit = await businessUnitApi.updateAssociate(request.query['key'], accountId, roleKeys);

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
  const businessUnitApi = new BusinessUnitApi(
    actionContext.frontasticContext,
    getLocale(request),
    getCurrency(request),
  );

  const requestData = parseRequestBody<BusinessUnitRequestBody>(request.body);
  const businessUnitRequestData: BusinessUnit = {
    ...requestData,
    contactEmail: requestData.contactEmail,
    name: requestData.name,
    key: request.query['key'],
  };

  try {
    const businessUnit = await businessUnitApi.updateBusinessUnit(businessUnitRequestData);

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
  const businessUnitApi = new BusinessUnitApi(
    actionContext.frontasticContext,
    getLocale(request),
    getCurrency(request),
  );

  const requestData = parseRequestBody<{ address: Address }>(request.body);

  const addressData = BaseAccountMapper.addressToCommercetoolsAddress(requestData.address);

  try {
    const businessUnit = await businessUnitApi.addBusinessUnitAddress(request.query['key'], addressData);

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
  const businessUnitApi = new BusinessUnitApi(
    actionContext.frontasticContext,
    getLocale(request),
    getCurrency(request),
  );

  const requestData = parseRequestBody<{ address: Address }>(request.body);

  const addressData = BaseAccountMapper.addressToCommercetoolsAddress(requestData.address);

  const businessUnitKey = request.query['key'];

  try {
    const businessUnit = await businessUnitApi.updateBusinessUnitAddress(businessUnitKey, addressData);

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
  const businessUnitApi = new BusinessUnitApi(
    actionContext.frontasticContext,
    getLocale(request),
    getCurrency(request),
  );
  const requestData = parseRequestBody<{ addressId: string }>(request.body);
  const addressId = requestData.addressId;

  try {
    const businessUnit = await businessUnitApi.removeBusinessUnitAddress(request.query['key'], addressId);

    return {
      statusCode: 200,
      body: JSON.stringify(businessUnit),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const getByKey: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const businessUnitApi = new BusinessUnitApi(
    actionContext.frontasticContext,
    getLocale(request),
    getCurrency(request),
  );
  const key = request.query?.['key'];

  const account = fetchAccountFromSession(request);

  if (account === undefined) {
    throw new AccountAuthenticationError({ message: 'Not logged in.' });
  }

  try {
    const businessUnit = await businessUnitApi.get(key, account);

    return {
      statusCode: 200,
      body: JSON.stringify(businessUnit),
      sessionData: request.sessionData,
    };
  } catch (error) {
    const errorInfo = error as Error;
    return {
      statusCode: 400,
      body: JSON.stringify(errorInfo.message),
      sessionData: request.sessionData,
    };
  }
};

export const remove: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const businessUnitApi = new BusinessUnitApi(
    actionContext.frontasticContext,
    getLocale(request),
    getCurrency(request),
  );
  const key = request.query?.['key'];

  let response: Response;

  try {
    const businessUnit = await businessUnitApi.delete(key);
    response = {
      statusCode: 200,
      body: JSON.stringify(businessUnit),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }

  return response;
};

export const getAssociateRoles: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const businessUnitApi = new BusinessUnitApi(
    actionContext.frontasticContext,
    getLocale(request),
    getCurrency(request),
  );

  const associateRoles = await businessUnitApi.getAssociateRoles();

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(associateRoles),
    sessionData: request.sessionData,
  };

  return response;
};
