import { Context, Request } from '@frontastic/extension-types';
import QuoteApi from '../../apis/QuoteApi';
import { getBusinessUnitKey, getCurrency, getLocale } from '../requestHandlers/Request';
import { AccountFetcher } from '../AccountFetcher';

const getQuoteApi = (request: Request, actionContext: Context): QuoteApi => {
  const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

  const businessUnitKey = getBusinessUnitKey(request);

  return new QuoteApi(actionContext, getLocale(request), getCurrency(request), accountId, businessUnitKey);
};

export default getQuoteApi;
