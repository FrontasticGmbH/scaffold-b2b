import { ActionContext, Request } from '@frontastic/extension-types';
import { Cart } from '@Types/cart/Cart';
import { CartApi } from '../apis/CartApi';
import { getCurrency, getLocale } from './Request';
import parseRequestBody from '@Commerce-commercetools/utils/parseRequestBody';
import parseQueryParams from '@Commerce-commercetools/utils/parseRequestParams';
import { Account } from '@Types/account';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';

interface CartFetcherRequest {
  storeKey?: string;
  businessUnitKey?: string;
  key?: string;
}

export class CartFetcher {
  static async fetchCart(request: Request, actionContext: ActionContext): Promise<Cart | undefined> {
    const requestBody = parseRequestBody<CartFetcherRequest>(request.body);
    const requestParams = parseQueryParams<CartFetcherRequest>(request.query);

    const queryBusinessUnitKey = requestParams?.businessUnitKey || requestParams?.key;

    const account: Account = request.sessionData?.account;
    const cartId = request.sessionData?.cartId;
    const businessUnitKey = queryBusinessUnitKey !== undefined ? queryBusinessUnitKey : requestParams.businessUnitKey;

    const storeKey = requestBody?.storeKey !== undefined ? requestBody.storeKey : requestParams.storeKey;

    if (businessUnitKey && account) {
      const cartApi = new CartApi(
        actionContext.frontasticContext,
        getLocale(request),
        getCurrency(request),
        account.accountId,
        businessUnitKey,
      );

      if (cartId) {
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
      }

      if (!storeKey) {
        throw new ValidationError({ message: 'No store key' });
      }

      return await cartApi.getInStore(storeKey);
    }

    return undefined;
  }
}
