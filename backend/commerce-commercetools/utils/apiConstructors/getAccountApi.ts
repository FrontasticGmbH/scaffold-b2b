import { Context, Request } from '@frontastic/extension-types';
import AccountApi from '@Commerce-commercetools/apis/AccountApi';
import { getCurrency, getLocale } from '@Commerce-commercetools/utils/requestHandlers/Request';

const getAccountApi = (request: Request, actionContext: Context): AccountApi => {
  const locale = getLocale(request);
  const currency = getCurrency(request);

  return new AccountApi(actionContext, locale, currency);
};

export default getAccountApi;
