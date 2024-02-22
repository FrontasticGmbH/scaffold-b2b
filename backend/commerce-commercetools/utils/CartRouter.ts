import { Context, Request } from '@frontastic/extension-types';
import { Order } from '@Types/cart/Order';
import { PaginatedResult } from '@Types/result';
import { fetchAccountFromSessionEnsureLoggedIn } from './fetchAccountFromSession';
import { getPath } from './Request';
import { OrderQueryFactory } from '@Commerce-commercetools/utils/OrderQueryFactory';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';
import getCartApi from '@Commerce-commercetools/utils/getCartApi';

const orderRegex = /\/order\/([^\/]+)/;
const ordersRegex = /\/orders/;
const orderPreviewRegex = /\/preview\/.+\/order\/([^\/]+)/;
const ordersPreviewRegex = /\/preview\/.+\/orders/;
const thankYouRegex = /\/thank-you/;

export default class CartRouter {
  static identifyOrderFrom(request: Request) {
    if (
      getPath(request)?.match(orderRegex) ||
      getPath(request)?.match(orderPreviewRegex) ||
      getPath(request)?.match(thankYouRegex)
    ) {
      return true;
    }

    return false;
  }

  static identifyOrdersFrom(request: Request) {
    if (getPath(request)?.match(ordersRegex) || getPath(request)?.match(ordersPreviewRegex)) {
      return true;
    }

    return false;
  }

  static loadOrderFor = async (request: Request, frontasticContext: Context): Promise<Order> => {
    let urlMatches = getPath(request)?.match(orderRegex);

    if (urlMatches) {
      return await this.getOrder(request, frontasticContext, urlMatches[1]);
    }

    urlMatches = getPath(request)?.match(orderPreviewRegex);

    if (urlMatches) {
      return await this.getOrder(request, frontasticContext, urlMatches[1]);
    }

    urlMatches = getPath(request)?.match(thankYouRegex);
    if (urlMatches && request.query?.orderId) {
      return await this.getOrder(request, frontasticContext, request.query.orderId);
    }

    return null;
  };

  static loadOrdersFor = async (request: Request, frontasticContext: Context): Promise<PaginatedResult<Order>> => {
    let urlMatches = getPath(request)?.match(ordersRegex);

    if (urlMatches) {
      return await this.getOrders(request, frontasticContext);
    }

    urlMatches = getPath(request)?.match(ordersPreviewRegex);
    if (urlMatches) {
      return await this.getOrders(request, frontasticContext);
    }

    return null;
  };

  static getOrderPageType(request: Request) {
    if (getPath(request)?.match(orderRegex)) {
      return 'frontastic/order-page';
    }

    if (getPath(request)?.match(orderPreviewRegex)) {
      return 'frontastic/preview/order-page';
    }

    if (getPath(request)?.match(thankYouRegex)) {
      return 'frontastic/thank-you-page';
    }

    throw new ResourceNotFoundError({ message: 'Page type not found' });
  }

  private static async getOrder(request: Request, frontasticContext: Context, orderId: string) {
    const account = fetchAccountFromSessionEnsureLoggedIn(request);
    const cartApi = getCartApi(request, frontasticContext);
    const orderQuery = OrderQueryFactory.queryFromParams(request, account);
    let result;

    try {
      orderQuery.orderIds = [orderId];
      result = await cartApi.queryOrders(orderQuery);

      if (result?.items.length > 0) {
        return result?.items[0];
      }
    } catch (error) {
      // We ignore the error deliberately, so we can try the next query
    }

    try {
      delete orderQuery.orderIds;
      orderQuery.orderNumbers = [orderId];
      result = await cartApi.queryOrders(orderQuery);

      if (result?.items.length > 0) {
        return result?.items[0];
      }
    } catch (error) {
      // We are not throwing the error, because we want to return null if the order is not found
    }

    return null;
  }

  private static async getOrders(request: Request, frontasticContext: Context) {
    const account = fetchAccountFromSessionEnsureLoggedIn(request);

    const cartApi = getCartApi(request, frontasticContext);

    const orderQuery = OrderQueryFactory.queryFromParams(request, account);

    return await cartApi.queryOrders(orderQuery);
  }
}
