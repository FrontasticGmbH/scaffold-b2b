import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { Store } from '@Types/store/Store';
import { Account } from '@Types/account/Account';
import { Address } from '@Types/account/Address';
import { BusinessUnit } from '@Types/business-unit/BusinessUnit';
import { BusinessUnitApi } from '../apis/BusinessUnitApi';
import { getBusinessUnitKey, getCurrency, getLocale, getStoreKey } from '../utils/Request';
import { AccountApi } from '@Commerce-commercetools/apis/AccountApi';

import { fetchAccountFromSession } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import handleError from '@Commerce-commercetools/utils/handleError';
import { EmailApiFactory } from '@Commerce-commercetools/utils/EmailApiFactory';
import { AccountMapper } from '@Commerce-commercetools/mappers/AccountMapper';
import parseRequestBody from '@Commerce-commercetools/utils/parseRequestBody';
import getCartApi from '@Commerce-commercetools/utils/getCartApi';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';
import { assertIsAuthenticated } from '@Commerce-commercetools/utils/assertIsAuthenticated';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export interface BusinessUnitRequestBody {
  account: Account;
  store?: Store;
  parentBusinessUnit?: string;
  name?: string;
  contactEmail?: string;
}

export const getBusinessUnits: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    assertIsAuthenticated(request);

    const account = fetchAccountFromSession(request);

    const businessUnitApi = new BusinessUnitApi(
      actionContext.frontasticContext,
      getLocale(request),
      getCurrency(request),
    );

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

    const businessUnitApi = new BusinessUnitApi(
      actionContext.frontasticContext,
      getLocale(request),
      getCurrency(request),
    );

    const businessUnitRequestBody: BusinessUnitRequestBody = JSON.parse(request.body);

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

    const businessUnitApi = new BusinessUnitApi(
      actionContext.frontasticContext,
      getLocale(request),
      getCurrency(request),
    );

    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
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

    const businessUnitApi = new BusinessUnitApi(
      actionContext.frontasticContext,
      getLocale(request),
      getCurrency(request),
    );

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

    const businessUnitApi = new BusinessUnitApi(
      actionContext.frontasticContext,
      getLocale(request),
      getCurrency(request),
    );

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

    const businessUnitApi = new BusinessUnitApi(
      actionContext.frontasticContext,
      getLocale(request),
      getCurrency(request),
    );

    const requestData = parseRequestBody<{ address: Address }>(request.body);

    const addressData = AccountMapper.addressToCommercetoolsAddress(requestData.address);
    const businessUnitKey = request.query['businessUnitKey'];

    const businessUnit = await businessUnitApi.addBusinessUnitAddress(businessUnitKey, account.accountId, addressData);

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
    const businessUnitApi = new BusinessUnitApi(
      actionContext.frontasticContext,
      getLocale(request),
      getCurrency(request),
    );

    const requestData = parseRequestBody<{ address: Address }>(request.body);

    const addressData = AccountMapper.addressToCommercetoolsAddress(requestData.address);

    const businessUnitKey = request.query['businessUnitKey'];

    const businessUnit = await businessUnitApi.updateBusinessUnitAddress(
      businessUnitKey,
      account.accountId,
      addressData,
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

export const removeBusinessUnitAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    assertIsAuthenticated(request);

    const account = fetchAccountFromSession(request);
    const businessUnitApi = new BusinessUnitApi(
      actionContext.frontasticContext,
      getLocale(request),
      getCurrency(request),
    );

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

export const getByKey: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    assertIsAuthenticated(request);

    const account = fetchAccountFromSession(request);

    const businessUnitApi = new BusinessUnitApi(
      actionContext.frontasticContext,
      getLocale(request),
      getCurrency(request),
    );

    const businessUnitKey = request.query?.['businessUnitKey'];

    const businessUnit = await businessUnitApi.getByKeyForUser(businessUnitKey, account.accountId, true);

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

    const businessUnitApi = new BusinessUnitApi(
      actionContext.frontasticContext,
      getLocale(request),
      getCurrency(request),
    );

    await businessUnitApi.assertUserIsAssociate(account.accountId, businessUnitKey, storeKey);

    return {
      statusCode: 200,
      body: JSON.stringify({}),
      sessionData: {
        ...request.sessionData,
        businessUnitKey,
        storeKey,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};
