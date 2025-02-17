import { ActionContext, Request } from '@frontastic/extension-types';
import { Cart } from '@Types/cart/Cart';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';
import getCartApi from '@Commerce-commercetools/utils/apiConstructors/getCartApi';
import { fetchAccountFromSession } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import { getBusinessUnitKey, getStoreKey } from '@Commerce-commercetools/utils/requestHandlers/Request';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';

export class CartFetcher {
  static async fetchCart(request: Request, actionContext: ActionContext): Promise<Cart> {
    const cart = await this.fetchActiveCartFromSession(request, actionContext);

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

    return await getCartApi(request, actionContext.frontasticContext).createCartInStore(storeKey);
  }

  static async fetchActiveCartFromSession(request: Request, actionContext: ActionContext): Promise<Cart | undefined> {
    const cartId = request.sessionData?.cartId;
    const account = fetchAccountFromSession(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const storeKey = getStoreKey(request);

    // In B2B we use associate endpoints so we need to validate the account, business unit key, and store key for the cart
    if (!account || !businessUnitKey || !storeKey) {
      return undefined;
    }

    const cartApi = getCartApi(request, actionContext.frontasticContext);

    try {
      if (cartId) {
        const cart = await cartApi.getById(cartId);
        if (
          cartApi.assertCartIsActive(cart) &&
          cartApi.assertCartForBusinessUnitAndStore(cart, businessUnitKey, storeKey)
        ) {
          return cart;
        }
      }
    } catch (error) {
      // Ignore the ResourceNotFoundError as it's expected if the cart does not exist
      if (!(error instanceof ResourceNotFoundError)) {
        throw error;
      }
    }

    return await cartApi.getActiveCartInStore(storeKey);
  }
}
