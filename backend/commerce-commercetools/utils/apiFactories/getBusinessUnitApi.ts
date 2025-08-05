import { Context, Request } from '@frontastic/extension-types';
import BusinessUnitApi from '@Commerce-commercetools/apis/BusinessUnitApi';
import { getCurrency, getLocale } from '@Commerce-commercetools/utils/requestHandlers/Request';

const getBusinessUnitApi = (request: Request, actionContext: Context): BusinessUnitApi => {
  const locale = getLocale(request);
  const currency = getCurrency(request);

  return new BusinessUnitApi(actionContext, locale, currency, request);
};
export default getBusinessUnitApi;
