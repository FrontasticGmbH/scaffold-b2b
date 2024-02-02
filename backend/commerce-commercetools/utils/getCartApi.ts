import { Context, Request } from '@frontastic/extension-types';
import { fetchAccountFromSession } from './fetchAccountFromSession';
import parseQueryParams from './parseRequestParams';
import { CartApi } from '../apis/CartApi';
import { getCurrency, getLocale } from './Request';
import { assertIsAuthenticated } from '@Commerce-commercetools/utils/assertIsAuthenticated';

const getCartApi = (request: Request, actionContext: Context) => {
  assertIsAuthenticated(request);
  const account = fetchAccountFromSession(request);
  const { businessUnitKey, key } = parseQueryParams<{ businessUnitKey: string; key: string }>(request.query);

  const BusinessUnitKey = businessUnitKey ?? key;

  return new CartApi(actionContext, getLocale(request), getCurrency(request), account.accountId, BusinessUnitKey);
};

export default getCartApi;
