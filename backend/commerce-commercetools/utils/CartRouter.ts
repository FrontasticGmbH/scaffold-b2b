import { Context, Request } from '@frontastic/extension-types';
import { getCurrency, getLocale, getPath } from './Request';
import { CartApi } from '../apis/CartApi';
import { fetchAccountFromSession } from './fetchAccountFromSession';
import { Order } from '@Types/cart/Order';

export default class CartRouter {
  static identifyOrderFrom(request: Request) {
    if (getPath(request)?.match(/\/order\/([^\/]+)/)) {
      return true;
    }

    return false;
  }

  static identifyOrderPreviewFrom(request: Request) {
    if (getPath(request)?.match(/\/preview\/.+\/order\/([^\/]+)/)) {
      return true;
    }

    return false;
  }

  static loadOrderFor = async (request: Request, frontasticContext: Context): Promise<Order> => {
    const cartApi = new CartApi(frontasticContext, getLocale(request), getCurrency(request));

    const account = fetchAccountFromSession(request);

    const urlMatches = getPath(request)?.match(/\/order\/([^\/]+)/);

    if (urlMatches) {
      return cartApi.getOrder(urlMatches[1], account);
    }

    return null;
  };

  static loadOrderPreviewFor = async (request: Request, frontasticContext: Context): Promise<Order> => {
    const cartApi = new CartApi(frontasticContext, getLocale(request), getCurrency(request));

    const urlMatches = getPath(request)?.match(/\/preview\/.+\/order\/([^\/]+)/);

    const account = fetchAccountFromSession(request);
    if (urlMatches) {
      return cartApi.getOrder(urlMatches[1], account);
    }

    return null;
  };
}
