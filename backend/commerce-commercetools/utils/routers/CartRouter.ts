import { Context, Request } from '@frontastic/extension-types';
import { Order } from '@Types/cart/Order';
import { PaginatedResult } from '@Types/result';
import { RecurringOrder } from '@Types/cart';
import { getPath } from '../requestHandlers/Request';
import { RecurringOrderFactory } from '../RecurringOrderQueryFactory';
import { OrderQueryFactory } from '@Commerce-commercetools/utils/OrderQueryFactory';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';
import getCartApi from '@Commerce-commercetools/utils/apiFactories/getCartApi';

const orderRegex = /\/order\/([^\/]+)/;
const ordersRegex = /\/orders/;
const recurringOrderRegex = /\/recurring-order\/([^\/]+)/;
const recurringOrdersRegex = /\/recurring-orders/;
const thankYouRegex = /\/thank-you/;

export default class CartRouter {
  static identifyOrderFrom(request: Request) {
    if (getPath(request)?.match(orderRegex) || getPath(request)?.match(thankYouRegex)) {
      return true;
    }

    return false;
  }

  static identifyRecurringOrderFrom(request: Request) {
    if (getPath(request)?.match(recurringOrderRegex)) {
      return true;
    }

    return false;
  }

  static identifyRecurringOrdersFrom(request: Request) {
    if (getPath(request)?.match(recurringOrdersRegex)) {
      return true;
    }

    return false;
  }

  static identifyOrdersFrom(request: Request) {
    if (getPath(request)?.match(ordersRegex)) {
      return true;
    }

    return false;
  }

  static loadOrderFor = async (request: Request, commercetoolsFrontendContext: Context): Promise<Order> => {
    let urlMatches = getPath(request)?.match(orderRegex);

    if (urlMatches) {
      return await this.getOrder(request, commercetoolsFrontendContext, urlMatches[1]);
    }

    urlMatches = getPath(request)?.match(thankYouRegex);
    if (urlMatches && request.query?.orderId) {
      return await this.getOrder(request, commercetoolsFrontendContext, request.query.orderId);
    }

    return null;
  };

  static loadOrdersFor = async (
    request: Request,
    commercetoolsFrontendContext: Context,
  ): Promise<PaginatedResult<Order>> => {
    const urlMatches = getPath(request)?.match(ordersRegex);

    if (urlMatches) {
      return await this.getOrders(request, commercetoolsFrontendContext);
    }

    return null;
  };

  static loadRecurringOrderFor = async (
    request: Request,
    commercetoolsFrontendContext: Context,
  ): Promise<RecurringOrder> => {
    let urlMatches = getPath(request)?.match(recurringOrderRegex);

    if (urlMatches) {
      return await this.getRecurringOrder(request, commercetoolsFrontendContext, urlMatches[1]);
    }

    urlMatches = getPath(request)?.match(thankYouRegex);
    if (urlMatches && request.query?.recurringOrderId) {
      return await this.getRecurringOrder(request, commercetoolsFrontendContext, request.query.recurringOrderId);
    }

    return null;
  };

  static loadRecurringOrdersFor = async (
    request: Request,
    commercetoolsFrontendContext: Context,
  ): Promise<PaginatedResult<RecurringOrder>> => {
    const urlMatches = getPath(request)?.match(recurringOrdersRegex);

    if (urlMatches) {
      return await this.getRecurringOrders(request, commercetoolsFrontendContext);
    }

    return null;
  };

  static getOrderPageType(request: Request) {
    if (getPath(request)?.match(orderRegex)) {
      return 'frontastic/order-page';
    }

    if (getPath(request)?.match(thankYouRegex)) {
      return 'frontastic/thank-you-page';
    }

    throw new ResourceNotFoundError({ message: 'Page type not found' });
  }

  static getRecurringOrderPageType(request: Request) {
    if (getPath(request)?.match(recurringOrderRegex)) {
      return 'frontastic/recurring-order-page';
    }

    if (getPath(request)?.match(thankYouRegex)) {
      return 'frontastic/thank-you-page';
    }

    throw new ResourceNotFoundError({ message: 'Page type not found' });
  }

  private static async getOrder(request: Request, commercetoolsFrontendContext: Context, orderId: string) {
    const cartApi = getCartApi(request, commercetoolsFrontendContext);
    const orderQuery = OrderQueryFactory.queryFromParams(request);
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

  private static async getOrders(request: Request, commercetoolsFrontendContext: Context) {
    const cartApi = getCartApi(request, commercetoolsFrontendContext);

    const orderQuery = OrderQueryFactory.queryFromParams(request);

    return await cartApi.queryOrders(orderQuery);
  }

  private static async getRecurringOrder(
    request: Request,
    commercetoolsFrontendContext: Context,
    recurringOrderId: string,
  ) {
    const cartApi = getCartApi(request, commercetoolsFrontendContext);
    const recurringOrderQuery = RecurringOrderFactory.queryFromParams(request);
    let result;

    try {
      recurringOrderQuery.recurringOrderIds = [recurringOrderId];
      result = await cartApi.queryRecurringOrders(recurringOrderQuery);

      if (result?.items.length > 0) {
        return result?.items[0];
      }
    } catch (error) {
      // We ignore the error deliberately, so we can try the next query
    }

    return null;
  }

  private static async getRecurringOrders(request: Request, commercetoolsFrontendContext: Context) {
    const cartApi = getCartApi(request, commercetoolsFrontendContext);

    const recurringOrdersQuery = RecurringOrderFactory.queryFromParams(request);

    return await cartApi.queryRecurringOrders(recurringOrdersQuery);
  }
}
