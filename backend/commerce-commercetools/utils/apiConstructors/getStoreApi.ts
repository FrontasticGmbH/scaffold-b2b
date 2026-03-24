import { Context } from '@frontastic/extension-types';
import StoreApi from '@Commerce-commercetools/apis/StoreApi';

const getStoreApi = (actionContext: Context, locale: string, currency: string): StoreApi => {
  return new StoreApi(actionContext, locale, currency);
};

export default getStoreApi;
