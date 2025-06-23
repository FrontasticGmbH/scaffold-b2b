import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { Account } from '@Types/account/Account';
import { Address } from '@Types/account';
import { ValidationError } from '../errors/ValidationError';
import { getLocale } from '@Commerce-commercetools/utils/requestHandlers/Request';
import { CartFetcher } from '@Commerce-commercetools/utils/CartFetcher';
import { EmailApiFactory } from '@Commerce-commercetools/utils/EmailApiFactory';
import { businessUnitKeyFormatter } from '@Commerce-commercetools/utils/BusinessUnitFormatter';
import AccountMapper from '@Commerce-commercetools/mappers/AccountMapper';
import handleError from '@Commerce-commercetools/utils/handleError';
import parseRequestBody from '@Commerce-commercetools/utils/requestHandlers/parseRequestBody';
import { AccountAuthenticationError } from '@Commerce-commercetools/errors/AccountAuthenticationError';
import { BusinessUnitDuplicatedError } from '@Commerce-commercetools/errors/BusinessUnitDuplicatedError';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';
import getAccountApi from '@Commerce-commercetools/utils/apiConstructors/getAccountApi';
import getBusinessUnitApi from '@Commerce-commercetools/utils/apiConstructors/getBusinessUnitApi';
import { AccountFetcher } from '@Commerce-commercetools/utils/AccountFetcher';

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

  const cart = await CartFetcher.fetchActiveCartFromSession(request, actionContext.frontasticContext);

  const { account: loggedInAccount, cart: loggedInCart } = await accountApi.login(account, cart);

  if (!loggedInAccount.confirmed && loggedInAccount.confirmationToken) {
    const locale = getLocale(request);

    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);
    await emailApi.sendAccountVerificationEmail(loggedInAccount);

    throw new AccountAuthenticationError({
      message: `Your email address "${loggedInAccount.email}" was not yet verified. Please check your inbox.`,
    });
  }

  const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

  const businessUnits = await businessUnitApi.getBusinessUnitsForUser(loggedInAccount.accountId, true);

  // By default, we'll select the first business unit and store for the user.
  const businessUnitKey = businessUnits?.[0]?.key;
  const storeKey = businessUnits?.[0]?.stores?.[0]?.key;
  const storeId = businessUnits?.[0]?.stores?.[0]?.storeId;
  const distributionChannelId = businessUnits?.[0]?.stores?.[0]?.distributionChannels?.[0]?.channelId;
  const supplyChannelId = businessUnits?.[0]?.stores?.[0]?.supplyChannels?.[0]?.channelId;
  const productSelectionId = businessUnits?.[0]?.stores?.[0]?.productSelectionIds?.[0];

  return {
    statusCode: 200,
    body: JSON.stringify(loggedInAccount),
    sessionData: {
      ...request.sessionData,
      ...(loggedInAccount
        ? { accountId: loggedInAccount.accountId, accountGroupIds: loggedInAccount.accountGroupIds }
        : {}),
      ...(loggedInCart ? { cartId: loggedInCart.cartId } : {}),
      businessUnitKey,
      storeKey,
      storeId,
      distributionChannelId,
      supplyChannelId,
      productSelectionId,
    },
  };
}

export const getAccount: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSession(request);

    if (!accountId) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          loggedIn: false,
        }),
      };
    }

    const accountApi = getAccountApi(request, actionContext.frontasticContext);
    const account = await accountApi.getById(accountId);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify({
        loggedIn: true,
        account,
      }),
      sessionData: {
        ...request.sessionData,
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

    const account = AccountMapper.requestToAccount(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    if (account.companyName === undefined) {
      throw new ValidationError({ message: `The account passed doesn't contain a company.` });
    }

    // Validate if the business unit name exists using accountData.company
    const businessUnitApi = getBusinessUnitApi(request, actionContext.frontasticContext);

    let businessUnit = undefined;

    const businessUnitKey = businessUnitKeyFormatter(account.companyName);
    try {
      // Check if the business unit already exists. An error will be thrown if the business unit does not exist.
      businessUnit = await businessUnitApi.getByKey(businessUnitKey);

      if (businessUnit !== undefined) {
        throw new BusinessUnitDuplicatedError({ message: `The company ${account.companyName} already exists.` });
      }
    } catch (error) {
      // The business unit does not exist, so we can create a new one for the given company name.
      if (!(error instanceof ExternalError && error.statusCode === 404)) {
        throw error;
      }
    }

    const cart = await CartFetcher.fetchActiveCartFromSession(request, actionContext.frontasticContext);

    const createdAccount = await accountApi.create(account, cart);

    // Create the business unit for the account
    await businessUnitApi.createForAccount(createdAccount.accountId, createdAccount);

    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);

    emailApi.sendWelcomeCustomerEmail(createdAccount);

    if (!createdAccount.confirmed) {
      emailApi.sendAccountVerificationEmail(createdAccount);
    }

    // We are unsetting the confirmationToken to avoid exposing it to the client
    createdAccount.confirmationToken = null;

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(createdAccount),
      sessionData: {
        ...request.sessionData,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const requestConfirmationEmail: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const locale = getLocale(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const accountLoginBody: AccountLoginBody = JSON.parse(request.body);

    const account = {
      email: accountLoginBody.email,
      password: accountLoginBody.password,
    } as Account;

    const cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);

    const { account: loggedInAccount, cart: loggedInCart } = await accountApi.login(account, cart);

    if (loggedInAccount.confirmed) {
      const response: Response = {
        statusCode: 405,
        body: JSON.stringify(`Your email address "${loggedInAccount.email}" was verified already.`),
        sessionData: {
          ...accountApi.getSessionData(),
          ...(loggedInAccount ? { accountId: loggedInAccount.accountId } : {}),
          ...(loggedInCart ? { cartId: loggedInCart.cartId } : {}),
        },
      };

      return response;
    }

    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);

    emailApi.sendAccountVerificationEmail(loggedInAccount);

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
        ...(account ? { accountId: account.accountId } : {}),
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

export const logout: ActionHook = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({}),
    sessionData: {},
  } as Response;
};

/**
 * Change password
 */
export const password: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const accountChangePasswordBody: AccountChangePasswordBody = JSON.parse(request.body);

    const account = await accountApi.updatePassword(
      accountId,
      accountChangePasswordBody.oldPassword,
      accountChangePasswordBody.newPassword,
    );

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
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
        accountId: undefined,
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
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);
    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, getLocale(request));

    const account = AccountMapper.requestToAccount(request);

    const updatedAccount = await accountApi.update(accountId, account);

    if (!updatedAccount.confirmed) {
      emailApi.sendAccountVerificationEmail(updatedAccount);
    }

    // We are unsetting the confirmationToken to avoid exposing it to the client
    updatedAccount.confirmationToken = null;

    return {
      statusCode: 200,
      body: JSON.stringify(updatedAccount),
      sessionData: {
        ...request.sessionData,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const addAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const address: Address = JSON.parse(request.body).address;

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const account = await accountApi.addAddress(accountId, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const addShippingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const address: Address = JSON.parse(request.body).address;

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const account = await accountApi.addShippingAddress(accountId, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const addBillingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const address: Address = JSON.parse(request.body).address;

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const account = await accountApi.addBillingAddress(accountId, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const address: Address = JSON.parse(request.body).address;

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const account = await accountApi.updateAddress(accountId, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const removeAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const body: {
      address?: { id?: string };
    } = JSON.parse(request.body);

    const address: Address = {
      addressId: body.address?.id,
    };

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const account = await accountApi.removeAddress(accountId, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const setDefaultBillingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const address: Address = JSON.parse(request.body);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const account = await accountApi.setDefaultBillingAddress(accountId, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const setDefaultShippingAddress: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const address: Address = JSON.parse(request.body);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const account = await accountApi.setDefaultShippingAddress(accountId, address);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
      sessionData: {
        ...request.sessionData,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const deleteAccount: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const accountDeleteBody = parseRequestBody<{ password: string }>(request.body);

    const accountApi = getAccountApi(request, actionContext.frontasticContext);

    const account = {
      email: (await accountApi.getById(accountId)).email,
      password: accountDeleteBody.password,
    } as Account;

    // Try to login the account with the provided password before deleting it
    const { account: loggedInAccount } = await accountApi.login(account, undefined);

    await accountApi.delete(loggedInAccount);

    return {
      statusCode: 200,
      body: JSON.stringify(null),
      sessionData: {
        ...request.sessionData,
        accountId: undefined,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};
