import { Context, Request } from '@frontastic/extension-types';
import { CartApi } from '../apis/CartApi';
import { fetchAccountFromSession } from './fetchAccountFromSession';
import { getBusinessUnitKey, getCurrency, getLocale } from './Request';
import { assertIsAuthenticated } from '@Commerce-commercetools/utils/assertIsAuthenticated';

const getCartApi = (request: Request, actionContext: Context) => {
  assertIsAuthenticated(request);
  const account = fetchAccountFromSession(request);
  const businessUnitKey = getBusinessUnitKey(request);

  return new CartApi(actionContext, getLocale(request), getCurrency(request), account.accountId, businessUnitKey);
};

export default getCartApi;
