import { Context, Request } from '@frontastic/extension-types';
import { Cart } from '@Types/cart/Cart';
import { AccountFetcher } from './AccountFetcher';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';
import getCartApi from '@Commerce-commercetools/utils/apiConstructors/getCartApi';
import { getBusinessUnitKey, getStoreKey } from '@Commerce-commercetools/utils/requestHandlers/Request';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';

export class CartFetcher {
  static async fetchCart(request: Request, context: Context): Promise<Cart> {
    const cart = await this.fetchActiveCartFromSession(request, context);

    if (cart) {
      return cart;
    }

    const businessUnitKey = getBusinessUnitKey(request);
    const storeKey = getStoreKey(request);

    if (!businessUnitKey || !storeKey) {
      throw new ValidationError({
        message: 'Cart can not be fetch without business unit key and store key',
      });
    }

    return await getCartApi(request, context).createCartInStore(storeKey);
  }

  static async fetchActiveCartFromSession(request: Request, context: Context): Promise<Cart | undefined> {
    const accountId = AccountFetcher.fetchAccountIdFromSession(request);
    const cartId = request.sessionData?.cartId;
    const businessUnitKey = getBusinessUnitKey(request);
    const storeKey = getStoreKey(request);

    // In B2B we use associate endpoints so we need to validate the accountId, business unit key, and store key for the cart
    if (!accountId || !businessUnitKey || !storeKey) {
      return undefined;
    }

    const cartApi = getCartApi(request, context);

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
