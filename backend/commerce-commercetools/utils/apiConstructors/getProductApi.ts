import { Context, Request } from '@frontastic/extension-types';
import ProductApi from '@Commerce-commercetools/apis/ProductApi';
import { getCurrency, getLocale } from '@Commerce-commercetools/utils/requestHandlers/Request';

const getProductApi = (request: Request, actionContext: Context): ProductApi => {
  return new ProductApi(actionContext, getLocale(request), getCurrency(request));
};

export default getProductApi;
