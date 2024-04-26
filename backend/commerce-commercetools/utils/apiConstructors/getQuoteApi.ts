import { Context, Request } from '@frontastic/extension-types';
import QuoteApi from '../../apis/QuoteApi';
import { fetchAccountFromSession } from '../fetchAccountFromSession';
import { getBusinessUnitKey, getCurrency, getLocale } from '../requestHandlers/Request';
import { assertIsAuthenticated } from '../assertIsAuthenticated';

const getQuoteApi = (request: Request, actionContext: Context): QuoteApi => {
  assertIsAuthenticated(request);
  const account = fetchAccountFromSession(request);

  const businessUnitKey = getBusinessUnitKey(request);

  return new QuoteApi(actionContext, getLocale(request), getCurrency(request), account.accountId, businessUnitKey);
};

export default getQuoteApi;
