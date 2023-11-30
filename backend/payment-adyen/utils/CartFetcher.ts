import { ActionContext, Request } from '@frontastic/extension-types';
import { Cart } from '@Types/cart/Cart';
import { getLocale } from './Request';
import { CartApi } from '@Commerce-commercetools/apis/CartApi';
import { getCurrency } from '@Commerce-commercetools/utils/Request';

export class CartFetcher {
  static async fetchCart(request: Request, actionContext: ActionContext): Promise<Cart> {
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

    if (request.sessionData?.account !== undefined) {
      return await cartApi.getForUser(request.sessionData.account, request.sessionData.organization);
    }

    if (request.sessionData?.cartId !== undefined) {
      try {
        return (await cartApi.getById(request.sessionData.cartId)) as Cart;
      } catch (error) {
        console.info(`Error fetching the cart ${request.sessionData.cartId}, creating a new one. ${error}`);
      }
    }
    // @ts-ignore
    return {};
  }
}
