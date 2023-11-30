import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { AccountRegisterBody as BaseAccountRegisterBody } from './BaseAccountController';
import { Account } from '@Types/account/Account';
import { getCurrency, getLocale } from '@Commerce-commercetools/utils/Request';
import { AccountApi } from '@Commerce-commercetools/apis/AccountApi';
import { CartFetcher } from '@Commerce-commercetools/utils/CartFetcher';
import { EmailApiFactory } from '@Commerce-commercetools/utils/EmailApiFactory';
import { BusinessUnitApi } from '@Commerce-commercetools/apis/BusinessUnitApi';
import { StoreApi } from '@Commerce-commercetools/apis/StoreApi';
import { ValidationError } from '../utils/Errors';
import { Store } from '@Types/store/Store';
import {
  businessUnitKeyFormatter,
  businessUnitNameNormalizer,
} from '@Commerce-commercetools/utils/BussinessUnitFormatter';
import { AccountMapper } from '@Commerce-commercetools/mappers/AccountMapper';
import { assertIsAuthenticated } from '@Commerce-commercetools/utils/assertIsAuthenticated';
import { fetchAccountFromSession } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import handleError from '@Commerce-commercetools/utils/handleError';
import parseRequestBody from '@Commerce-commercetools/utils/parseRequestBody';

export * from './BaseAccountController';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export interface AccountRegisterBody extends BaseAccountRegisterBody {
  companyName?: string;
  confirmed?: boolean;
}

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
    const businessUnit = await businessUnitApi.getByKey(businessUnitKey);

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

  const account = await accountApi.create(accountData, cart);

  // Create the store for the account
  const storeApi = new StoreApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
  const storeRequest = { ...request };
  storeRequest.body = JSON.stringify({
    account: JSON.parse(request.body),
  });

  const storeData: Store = {
    key: `store_${businessUnitNameNormalizer(accountData.companyName)}`,
    name: accountData.companyName,
  };

  const store = await storeApi.create(storeData);

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
