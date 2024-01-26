import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { Account } from '@Types/account/Account';
import { getCurrency, getLocale } from '@Commerce-commercetools/utils/Request';
import { AccountApi } from '@Commerce-commercetools/apis/AccountApi';
import { CartFetcher } from '@Commerce-commercetools/utils/CartFetcher';
import { EmailApiFactory } from '@Commerce-commercetools/utils/EmailApiFactory';
import { BusinessUnitApi } from '@Commerce-commercetools/apis/BusinessUnitApi';
import { StoreApi } from '@Commerce-commercetools/apis/StoreApi';
import { ValidationError } from '../utils/Errors';
import { businessUnitKeyFormatter } from '@Commerce-commercetools/utils/BussinessUnitFormatter';
import { AccountMapper } from '@Commerce-commercetools/mappers/AccountMapper';
import { assertIsAuthenticated } from '@Commerce-commercetools/utils/assertIsAuthenticated';
import { fetchAccountFromSession } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import handleError from '@Commerce-commercetools/utils/handleError';
import parseRequestBody from '@Commerce-commercetools/utils/parseRequestBody';
import { AccountAuthenticationError } from '@Commerce-commercetools/errors/AccountAuthenticationError';
import { Address } from '@Types/account';

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
  const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  const cart = await CartFetcher.fetchCart(request, actionContext);

  try {
    account = await accountApi.login(account, cart);
  } catch (error) {
    if (error instanceof AccountAuthenticationError) {
      const response: Response = {
        statusCode: 401,
        body: JSON.stringify(error.message),
        sessionData: {
          ...request.sessionData,
          account: account,
        },
      };

      return response;
    }

    throw error;
  }

  if (!account.confirmed && account.confirmationToken) {
    const locale = getLocale(request);

    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);
    emailApi.sendAccountVerificationEmail(account);

    const response: Response = {
      statusCode: 401,
      body: JSON.stringify(`Your email address "${account.email}" was not yet verified. Please check your inbox.`),
      sessionData: {
        ...request.sessionData,
        account: account,
      },
    };

    return response;
  }

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(account),
    sessionData: {
      ...request.sessionData,
      account: account,
    },
  };

  return response;
}

export const getAccount: ActionHook = async (request: Request) => {
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
};

export const register: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const locale = getLocale(request);

  const accountData = AccountMapper.requestToAccount(request);

  const accountApi = new AccountApi(actionContext.frontasticContext, locale, getCurrency(request));

  if (accountData.companyName === undefined) {
    throw new ValidationError({ message: `The account passed doesn't contain a company.` });
  }

  // Validate if the business unit name exists using accountData.company
  const businessUnitApi = new BusinessUnitApi(
    actionContext.frontasticContext,
    getLocale(request),
    getCurrency(request),
  );

  const businessUnitKey = businessUnitKeyFormatter(accountData.companyName);
  try {
    const businessUnit = await businessUnitApi.getByKey(businessUnitKey, accountData.accountId);

    if (!!businessUnit) {
      return {
        statusCode: 400,
        body: `An account for the company ${accountData.companyName} already exists`,
        sessionData: request.sessionData,
      };
    }
  } catch (error) {
    // The company does not exist, so we can create the account for this company
  }

  const cart = await CartFetcher.fetchCart(request, actionContext);

  let account: Account;

  try {
    account = await accountApi.create(accountData, cart);
  } catch (error) {
    const errorInfo = error as Error;

    return {
      statusCode: 400,
      body: JSON.stringify(errorInfo.message),
      sessionData: request.sessionData,
    };
  }

  const storeApi = new StoreApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  const defaultStoreKey = storeApi.getDefaultKey();
  const store = await storeApi.get(defaultStoreKey);

  // Create the business unit for the account
  try {
    await businessUnitApi.createForAccountAndStore(account, store);
  } catch (error) {
    const errorInfo = error as Error;
    return {
      statusCode: 400,
      body: JSON.stringify(errorInfo.message),
      sessionData: request.sessionData,
    };
  }

  const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);

  emailApi.sendWelcomeCustomerEmail(account);

  if (!account.confirmed) {
    emailApi.sendAccountVerificationEmail(account);
  }

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(account),
    sessionData: {
      ...request.sessionData,
    },
  };

  return response;
};

export const deleteAccount: ActionHook = async (request: Request, actionContext: ActionContext) => {
  assertIsAuthenticated(request);

  try {
    let account = fetchAccountFromSession(request);

    const accountDeleteBody = parseRequestBody<{ password: string }>(request.body);

    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

    account = {
      email: account.email,
      password: accountDeleteBody.password,
    } as Account;

    account = await accountApi.login(account, undefined);

    await accountApi.delete(account);

    return {
      statusCode: 200,
      body: '',
      sessionData: {
        ...request.sessionData,
        account: null,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

const requestConfirmationEmail: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const locale = getLocale(request);

  const accountApi = new AccountApi(actionContext.frontasticContext, locale, getCurrency(request));

  const accountLoginBody: AccountLoginBody = JSON.parse(request.body);

  let account = {
    email: accountLoginBody.email,
    password: accountLoginBody.password,
  } as Account;

  const cart = await CartFetcher.fetchCart(request, actionContext);

  account = await accountApi.login(account, cart);

  if (account.confirmed) {
    const response: Response = {
      statusCode: 405,
      body: JSON.stringify(`Your email address "${account.email}" was verified already.`),
      sessionData: {
        ...request.sessionData,
        account: account,
      },
    };

    return response;
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
};

export const confirm: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

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
};

export const login: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const accountLoginBody: AccountLoginBody = JSON.parse(request.body);

  const account = {
    email: accountLoginBody.email,
    password: accountLoginBody.password,
  } as Account;

  return await loginAccount(request, actionContext, account);
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
    },
  } as Response;
};

/**
 * Change password
 */
export const password: ActionHook = async (request: Request, actionContext: ActionContext) => {
  assertIsAuthenticated(request);

  let account = fetchAccountFromSession(request);

  const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

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
};

/**
 * Request new reset token
 */
export const requestReset: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const locale = getLocale(request);

  type AccountRequestResetBody = {
    email?: string;
  };

  const accountApi = new AccountApi(actionContext.frontasticContext, locale, getCurrency(request));

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
  } as Response;
};

/**
 * Reset password
 */
export const reset: ActionHook = async (request: Request, actionContext: ActionContext) => {
  type AccountResetBody = {
    token?: string;
    newPassword?: string;
  };

  const accountResetBody: AccountResetBody = JSON.parse(request.body);

  const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  const account = await accountApi.resetPassword(accountResetBody.token, accountResetBody.newPassword);
  account.password = accountResetBody.newPassword;

  return await loginAccount(request, actionContext, account);
};

export const update: ActionHook = async (request: Request, actionContext: ActionContext) => {
  assertIsAuthenticated(request);

  let account = fetchAccountFromSession(request);

  const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  account = {
    ...account,
    ...AccountMapper.requestToAccount(request),
  };

  account = await accountApi.update(account);

  return {
    statusCode: 200,
    body: JSON.stringify(account),
    sessionData: {
      ...request.sessionData,
      account,
    },
  } as Response;
};

export const addAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  assertIsAuthenticated(request);

  let account = fetchAccountFromSession(request);

  const address: Address = JSON.parse(request.body).address;

  const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  account = await accountApi.addAddress(account, address);

  return {
    statusCode: 200,
    body: JSON.stringify(account),
    sessionData: {
      ...request.sessionData,
      account,
    },
  } as Response;
};

export const addShippingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  assertIsAuthenticated(request);

  let account = fetchAccountFromSession(request);

  const address: Address = JSON.parse(request.body).address;

  const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  account = await accountApi.addShippingAddress(account, address);

  return {
    statusCode: 200,
    body: JSON.stringify(account),
    sessionData: {
      ...request.sessionData,
      account,
    },
  } as Response;
};

export const addBillingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  assertIsAuthenticated(request);

  let account = fetchAccountFromSession(request);

  const address: Address = JSON.parse(request.body).address;

  const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  account = await accountApi.addBillingAddress(account, address);

  return {
    statusCode: 200,
    body: JSON.stringify(account),
    sessionData: {
      ...request.sessionData,
      account,
    },
  } as Response;
};

export const updateAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  assertIsAuthenticated(request);

  let account = fetchAccountFromSession(request);

  const address: Address = JSON.parse(request.body).address;

  const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  account = await accountApi.updateAddress(account, address);

  return {
    statusCode: 200,
    body: JSON.stringify(account),
    sessionData: {
      ...request.sessionData,
      account,
    },
  } as Response;
};

export const removeAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  assertIsAuthenticated(request);

  let account = fetchAccountFromSession(request);

  const body: {
    address?: { id?: string };
  } = JSON.parse(request.body);

  const address: Address = {
    addressId: body.address?.id,
  };

  const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  account = await accountApi.removeAddress(account, address);

  return {
    statusCode: 200,
    body: JSON.stringify(account),
    sessionData: {
      ...request.sessionData,
      account,
    },
  } as Response;
};

export const setDefaultBillingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  assertIsAuthenticated(request);

  let account = fetchAccountFromSession(request);

  const address: Address = JSON.parse(request.body);

  const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  account = await accountApi.setDefaultBillingAddress(account, address);

  return {
    statusCode: 200,
    body: JSON.stringify(account),
    sessionData: {
      ...request.sessionData,
      account,
    },
  } as Response;
};

export const setDefaultShippingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  assertIsAuthenticated(request);

  let account = fetchAccountFromSession(request);

  const address: Address = JSON.parse(request.body);

  const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  account = await accountApi.setDefaultShippingAddress(account, address);

  return {
    statusCode: 200,
    body: JSON.stringify(account),
    sessionData: {
      ...request.sessionData,
      account,
    },
  } as Response;
};
