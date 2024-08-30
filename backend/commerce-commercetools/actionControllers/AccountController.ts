import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { Account } from '@Types/account/Account';
import { Address } from '@Types/account';
import { ValidationError } from '../errors/ValidationError';
import { getLocale } from '@Commerce-commercetools/utils/requestHandlers/Request';
import { CartFetcher } from '@Commerce-commercetools/utils/CartFetcher';
import { EmailApiFactory } from '@Commerce-commercetools/utils/EmailApiFactory';
import { businessUnitKeyFormatter } from '@Commerce-commercetools/utils/BussinessUnitFormatter';
import AccountMapper from '@Commerce-commercetools/mappers/AccountMapper';
import { assertIsAuthenticated } from '@Commerce-commercetools/utils/assertIsAuthenticated';
import { fetchAccountFromSession } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import handleError from '@Commerce-commercetools/utils/handleError';
import parseRequestBody from '@Commerce-commercetools/utils/requestHandlers/parseRequestBody';
import { AccountAuthenticationError } from '@Commerce-commercetools/errors/AccountAuthenticationError';
import { BusinessUnitDuplicatedError } from '@Commerce-commercetools/errors/BusinessUnitDuplicatedError';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';
import getAccountApi from '@Commerce-commercetools/utils/apiConstructors/getAccountApi';
import getBusinessUnitApi from '@Commerce-commercetools/utils/apiConstructors/getBusinessUnitApi';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export interface AccountRegisterBody {
  email?: string;
  password?: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
  birthdayYear?: string;
  birthdayMonth?: string;
  birthdayDay?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  vatNumber?: string;
  companyName?: string;
  confirmed?: boolean;
}

export type AccountLoginBody = {
  email?: string;
  password?: string;
};

type AccountChangePasswordBody = {
  oldPassword: string;
  newPassword: string;
};

async function loginAccount(request: Request, actionContext: ActionContext, account: Account): Promise<Response> {
  const accountApi = getAccountApi(request, actionContext.frontasticContext);

  const cart = await CartFetcher.fetchActiveCartFromSession(request, actionContext);

  account = await accountApi.login(account, cart);

  if (!account.confirmed && account.confirmationToken) {
    const locale = getLocale(request);

    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);
    await emailApi.sendAccountVerificationEmail(account);

    throw new AccountAuthenticationError({
      message: `Your email address "${account.email}" was not yet verified. Please check your inbox.`,
    });
  }

  const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

  const businessUnits = await businessUnitApi.getBusinessUnitsForUser(account.accountId, true);

  // By default, we'll select the first business unit and store for the user.
  const businessUnitKey = businessUnits?.[0]?.key;
  const storeKey = businessUnits?.[0]?.stores?.[0]?.key;
  const storeId = businessUnits?.[0]?.stores?.[0]?.storeId;
  const distributionChannelId = businessUnits?.[0]?.stores?.[0]?.distributionChannels?.[0]?.channelId;
  const supplyChannelId = businessUnits?.[0]?.stores?.[0]?.supplyChannels?.[0]?.channelId;

  return {
    statusCode: 200,
    body: JSON.stringify(account),
    sessionData: {
      ...request.sessionData,
      account,
      businessUnitKey,
      storeKey,
      storeId,
      distributionChannelId,
      supplyChannelId,
    },
  };
}

export const getAccount: ActionHook = async (request: Request) => {
  try {
    const account = fetchAccountFromSession(request);

    if (account === undefined) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          loggedIn: false,
        }),
      };
    }

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify({
        loggedIn: true,
        account,
      }),
      sessionData: {
        ...request.sessionData,
        account: account,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const register: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const locale = getLocale(request);

    const accountData = AccountMapper.requestToAccount(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    if (accountData.companyName === undefined) {
      throw new ValidationError({ message: `The account passed doesn't contain a company.` });
    }

    // Validate if the business unit name exists using accountData.company
    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    let businessUnit = undefined;

    const businessUnitKey = businessUnitKeyFormatter(accountData.companyName);
    try {
      // Check if the business unit already exists. An error will be thrown if the business unit does not exist.
      businessUnit = await businessUnitApi.getByKey(businessUnitKey);

      if (businessUnit !== undefined) {
        throw new BusinessUnitDuplicatedError({ message: `The company ${accountData.companyName} already exists.` });
      }
    } catch (error) {
      // The business unit does not exist, so we can create a new one for the given company name.
      if (!(error instanceof ExternalError && error.statusCode === 404)) {
        throw error;
      }
    }

    const cart = await CartFetcher.fetchActiveCartFromSession(request, actionContext);

    const account = await accountApi.create(accountData, cart);

    // Create the business unit for the account
    await businessUnitApi.createForAccount(account);

    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);

    emailApi.sendWelcomeCustomerEmail(account);

    if (!account.confirmed) {
      emailApi.sendAccountVerificationEmail(account);
    }

    // We are unsetting the confirmationToken to avoid exposing it to the client
    account.confirmationToken = null;

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const deleteAccount: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    assertIsAuthenticated(request);

    let account = fetchAccountFromSession(request);

    const accountDeleteBody = parseRequestBody<{ password: string }>(request.body);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    account = {
      email: account.email,
      password: accountDeleteBody.password,
    } as Account;

    account = await accountApi.login(account, undefined);

    await accountApi.delete(account);

    return {
      statusCode: 200,
      body: JSON.stringify(null),
      sessionData: {
        ...request.sessionData,
        account: null,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const requestConfirmationEmail: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const locale = getLocale(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const accountLoginBody: AccountLoginBody = JSON.parse(request.body);

    let account = {
      email: accountLoginBody.email,
      password: accountLoginBody.password,
    } as Account;

    const cart = await CartFetcher.fetchCart(request, actionContext);

    account = await accountApi.login(account, cart);

    if (account.confirmed) {
      throw new AccountAuthenticationError({ message: `Your email address "${account.email}" was verified already.` });
    }

    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);

    emailApi.sendAccountVerificationEmail(account);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify({}),
      sessionData: {
        ...request.sessionData,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const confirm: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    type AccountConfirmBody = {
      token?: string;
    };

    const accountConfirmBody: AccountConfirmBody = JSON.parse(request.body);

    const account = await accountApi.confirmEmail(accountConfirmBody.token);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
        account: account,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const login: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountLoginBody: AccountLoginBody = JSON.parse(request.body);

    const account = {
      email: accountLoginBody.email,
      password: accountLoginBody.password,
    } as Account;

    return await loginAccount(request, actionContext, account);
  } catch (error) {
    return handleError(error, request);
  }
};

export const logout: ActionHook = async (request: Request) => {
  return {
    statusCode: 200,
    body: JSON.stringify({}),
    sessionData: {
      ...request.sessionData,
      account: undefined,
      cartId: undefined,
      wishlistId: undefined,
      businessUnitKey: undefined,
      storeKey: undefined,
      storeId: undefined,
      distributionChannelId: undefined,
      supplyChannelId: undefined,
    },
  } as Response;
};

/**
 * Change password
 */
export const password: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    assertIsAuthenticated(request);

    let account = fetchAccountFromSession(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const accountChangePasswordBody: AccountChangePasswordBody = JSON.parse(request.body);

    account = await accountApi.updatePassword(
      account,
      accountChangePasswordBody.oldPassword,
      accountChangePasswordBody.newPassword,
    );

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
        account,
      },
    } as Response;
  } catch (error) {
    return handleError(error, request);
  }
};

/**
 * Request new reset token
 */
export const requestReset: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const locale = getLocale(request);

    type AccountRequestResetBody = {
      email?: string;
    };

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const accountRequestResetBody: AccountRequestResetBody = JSON.parse(request.body);

    const passwordResetToken = await accountApi.generatePasswordResetToken(accountRequestResetBody.email);

    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);
    emailApi.sendPasswordResetEmail(accountRequestResetBody as Account, passwordResetToken.token);

    return {
      statusCode: 200,
      body: JSON.stringify({}),
      sessionData: {
        ...request.sessionData,
        // TODO: should we redirect to logout rather to unset the account?
        account: undefined,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

/**
 * Reset password
 */
export const reset: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    type AccountResetBody = {
      token?: string;
      newPassword?: string;
    };

    const accountResetBody: AccountResetBody = JSON.parse(request.body);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const account = await accountApi.resetPassword(accountResetBody.token, accountResetBody.newPassword);
    account.password = accountResetBody.newPassword;

    return await loginAccount(request, actionContext, account);
  } catch (error) {
    return handleError(error, request);
  }
};

export const update: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    assertIsAuthenticated(request);

    let account = fetchAccountFromSession(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);
    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, getLocale(request));

    account = {
      ...account,
      ...AccountMapper.requestToAccount(request),
    };

    account = await accountApi.update(account);

    if (!account.confirmed) {
      emailApi.sendAccountVerificationEmail(account);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
        account,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const addAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    assertIsAuthenticated(request);

    let account = fetchAccountFromSession(request);

    const address: Address = JSON.parse(request.body).address;

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    account = await accountApi.addAddress(account, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
        account,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const addShippingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    assertIsAuthenticated(request);

    let account = fetchAccountFromSession(request);

    const address: Address = JSON.parse(request.body).address;

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    account = await accountApi.addShippingAddress(account, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
        account,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const addBillingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    assertIsAuthenticated(request);

    let account = fetchAccountFromSession(request);

    const address: Address = JSON.parse(request.body).address;

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    account = await accountApi.addBillingAddress(account, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
        account,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    assertIsAuthenticated(request);

    let account = fetchAccountFromSession(request);

    const address: Address = JSON.parse(request.body).address;

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    account = await accountApi.updateAddress(account, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
        account,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const removeAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    assertIsAuthenticated(request);

    let account = fetchAccountFromSession(request);

    const body: {
      address?: { id?: string };
    } = JSON.parse(request.body);

    const address: Address = {
      addressId: body.address?.id,
    };

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    account = await accountApi.removeAddress(account, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
        account,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const setDefaultBillingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    assertIsAuthenticated(request);

    let account = fetchAccountFromSession(request);

    const address: Address = JSON.parse(request.body);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    account = await accountApi.setDefaultBillingAddress(account, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
        account,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const setDefaultShippingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    assertIsAuthenticated(request);

    let account = fetchAccountFromSession(request);

    const address: Address = JSON.parse(request.body);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    account = await accountApi.setDefaultShippingAddress(account, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
        account,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};
