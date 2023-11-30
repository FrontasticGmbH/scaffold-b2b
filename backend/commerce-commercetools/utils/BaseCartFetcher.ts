import { ActionContext, Request } from '@frontastic/extension-types';
import { Cart } from '@Types/cart/Cart';
import { CartApi } from '../apis/CartApi';
import { Guid } from './Guid';
import { getCurrency, getLocale } from './Request';

export class BaseCartFetcher {
  static async fetchCart(request: Request, actionContext: ActionContext): Promise<Cart> {
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

    if (request.sessionData?.account !== undefined) {
      return await cartApi.getForUser(request.sessionData.account);
    }

    if (request.sessionData?.cartId !== undefined) {
      try {
        return await cartApi.getById(request.sessionData.cartId);
      } catch (error) {
        console.info(`Error fetching the cart ${request.sessionData.cartId}, creating a new one. ${error}`);
      }
    }

    return await cartApi.getAnonymous(Guid.newGuid());
  }
}
