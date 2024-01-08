import { ActionContext, Request } from '@frontastic/extension-types';
import { Cart } from '@Types/cart/Cart';
import { CartApi } from '../apis/CartApi';
import { getCurrency, getLocale } from './Request';

export class CartFetcher {
  static async fetchCart(request: Request, actionContext: ActionContext): Promise<Cart> | undefined {
    const body = request?.body ?? JSON.parse(request.body);
    const businessUnitKey = request?.query?.['businessUnitKey'] ?? body?.['businessUnitKey'];
    const storeKey = request?.query?.['storeKey'] ?? body?.['storeKey'];

    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

    if (request.sessionData?.cartId !== undefined) {
      const cart = (await cartApi.getById(request.sessionData.cartId)) as Cart;

      if (cartApi.assertCartForBusinessUnitAndStore(cart, businessUnitKey, storeKey)) {
        return cart;
      }
    }

    if (businessUnitKey && storeKey && request.sessionData?.account !== undefined) {
      return await cartApi.getForUser(request.sessionData?.account, businessUnitKey, storeKey);
    }

    return undefined;
  }
}
