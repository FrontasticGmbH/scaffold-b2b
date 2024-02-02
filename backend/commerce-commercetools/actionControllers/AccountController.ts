import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { Account } from '@Types/account/Account';
import { getCurrency, getLocale } from '@Commerce-commercetools/utils/Request';
import { AccountApi } from '@Commerce-commercetools/apis/AccountApi';
import { CartFetcher } from '@Commerce-commercetools/utils/CartFetcher';
import { EmailApiFactory } from '@Commerce-commercetools/utils/EmailApiFactory';
import { BusinessUnitApi } from '@Commerce-commercetools/apis/BusinessUnitApi';
import { StoreApi } from '@Commerce-commercetools/apis/StoreApi';
import { ValidationError } from '../errors/ValidationError';
import { businessUnitKeyFormatter } from '@Commerce-commercetools/utils/BussinessUnitFormatter';
import { AccountMapper } from '@Commerce-commercetools/mappers/AccountMapper';
import { assertIsAuthenticated } from '@Commerce-commercetools/utils/assertIsAuthenticated';
import { fetchAccountFromSession } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import handleError from '@Commerce-commercetools/utils/handleError';
import parseRequestBody from '@Commerce-commercetools/utils/parseRequestBody';
import { AccountAuthenticationError } from '@Commerce-commercetools/errors/AccountAuthenticationError';
import { Address } from '@Types/account';
import { BusinessUnitDuplicatedError } from '@Commerce-commercetools/errors/BusinessUnitDuplicatedError';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';

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

  account = await accountApi.login(account, cart);

  if (!account.confirmed && account.confirmationToken) {
    const locale = getLocale(request);

    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);
    await emailApi.sendAccountVerificationEmail(account);

    throw new AccountAuthenticationError({
      message: `Your email address "${account.email}" was not yet verified. Please check your inbox.`,
    });
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

    const cart = await CartFetcher.fetchCart(request, actionContext);

    const account = await accountApi.create(accountData, cart);

    const storeApi = new StoreApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

    const defaultStoreKey = storeApi.getDefaultKey();
    const store = await storeApi.get(defaultStoreKey);

    // Create the business unit for the account
    await businessUnitApi.createForAccountAndStore(account, store);

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
  } catch (error) {
    return handleError(error, request);
  }
};

export const deleteAccount: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    assertIsAuthenticated(request);

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

export const requestConfirmationEmail: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
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

    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

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

    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

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

    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

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

    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

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

    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

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

    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

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

    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

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

    const accountApi = new AccountApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

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
