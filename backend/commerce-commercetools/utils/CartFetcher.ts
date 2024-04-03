import { ActionContext, Request } from '@frontastic/extension-types';
import { Cart } from '@Types/cart/Cart';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';
import getCartApi from '@Commerce-commercetools/utils/getCartApi';
import { fetchAccountFromSession } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import { getBusinessUnitKey, getStoreKey } from '@Commerce-commercetools/utils/Request';

export class CartFetcher {
  static async fetchCart(request: Request, actionContext: ActionContext): Promise<Cart> {
    const cart = await this.fetchCartFromSession(request, actionContext);

    if (cart) {
      return cart;
    }

    const account = fetchAccountFromSession(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const storeKey = getStoreKey(request);

    if (!account || !businessUnitKey || !storeKey) {
      throw new ValidationError({
        message: 'Cart can not be fetch without account, business unit key, and store key',
      });
    }

    return await getCartApi(request, actionContext.frontasticContext).getInStore(storeKey);
  }

  static async fetchCartFromSession(request: Request, actionContext: ActionContext): Promise<Cart | undefined> {
    const cartId = request.sessionData?.cartId;
    const account = fetchAccountFromSession(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const storeKey = getStoreKey(request);

    if (!cartId || !account || !businessUnitKey || !storeKey) {
      return undefined;
    }

    const cartApi = getCartApi(request, actionContext.frontasticContext);

    try {
      const cart = await cartApi.getById(cartId);
      if (cartApi.assertCartForBusinessUnitAndStore(cart, businessUnitKey, storeKey)) {
        return cart;
      }
    } catch (error) {
      // A ExternalError might be thrown if the cart does not exist or belongs to a different business unit,
      // in which case we should create a new cart.
      if (!(error instanceof ExternalError)) {
        throw error;
      }
    }

    return undefined;
  }
}
