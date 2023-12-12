import { Cart } from '@Types/cart/Cart';
import { LineItem } from '@Types/cart/LineItem';
import { Address } from '@Types/account/Address';
import { Order, OrderState, ReturnLineItem } from '@Types/cart/Order';
import { Account } from '@Types/account/Account';
import { Cart as CommercetoolsCart, CartDraft } from '@commercetools/platform-sdk';
import {
  CartAddItemShippingAddressAction,
  CartRemoveLineItemAction,
  CartSetCountryAction,
  CartSetCustomerIdAction,
  CartSetLineItemShippingDetailsAction,
  CartSetLocaleAction,
  CartUpdate,
  ItemShippingTarget,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/cart';
import { OrderFromCartDraft } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/order';
import { isReadyForCheckout } from '../utils/Cart';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';
import { CartMapper } from '../mappers/CartMapper';
import { BaseCartApi } from '@Commerce-commercetools/apis/BaseCartApi';
import { ByProjectKeyAsAssociateByAssociateIdInBusinessUnitKeyByBusinessUnitKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/in-business-unit/by-project-key-as-associate-by-associate-id-in-business-unit-key-by-business-unit-key-request-builder';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { ExternalError } from '@Commerce-commercetools/utils/Errors';
import { AccountMapper } from '@Commerce-commercetools/mappers/AccountMapper';
import { OrderQuery } from '@Types/cart/OrderQuery';
import { PaginatedResult } from '@Types/result';
import { ProductMapper } from '@Commerce-commercetools/mappers/ProductMapper';
import { getOffsetFromCursor } from '@Commerce-commercetools/utils/Pagination';

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export class CartApi extends BaseCartApi {
  protected account?: Account;

  getForUser: (account?: Account, businessUnitKey?: string, storeKey?: string) => Promise<Cart> = async (
    account?: Account,
    businessUnitKey?: string,
    storeKey?: string,
  ) => {
    try {
      const locale = await this.getCommercetoolsLocal();
      if (businessUnitKey && storeKey) {
        const allCarts = await this.getAllCarts(account, businessUnitKey, storeKey);
        if (allCarts.length >= 1) {
          const cart = await this.buildCartWithAvailableShippingMethods(allCarts[0], locale);
          if (this.assertCartForBusinessUnitAndStore(cart, businessUnitKey, storeKey)) {
            return cart;
          }
        }
      }

      return await this.createCart(account, businessUnitKey, storeKey);
    } catch (error) {
      throw new ExternalError({
        status: 400,
        message: 'getForUser failed',
        body: `getForUser failed. ${error}`,
      });
    }
  };

  getAllCarts: (account?: Account, businessUnitKey?: string, storeKey?: string) => Promise<CommercetoolsCart[]> =
    async (account?: Account, businessUnitKey?: string, storeKey?: string) => {
      const where = [`cartState="Active"`];

      if (storeKey) {
        where.push(`store(key="${storeKey}")`);
      }

      where.push(`customerId="${account.accountId}"`);

      return await this.associateEndpoints(account, businessUnitKey)
        .carts()
        .get({
          queryArgs: {
            limit: 15,
            expand: [
              'lineItems[*].discountedPrice.includedDiscounts[*].discount',
              'discountCodes[*].discountCode',
              'paymentInfo.payments[*]',
            ],
            where,
            sort: 'createdAt desc',
          },
        })
        .execute()
        .then((response) => {
          if (response.body.count >= 1) {
            return response.body.results;
          }
          return [];
        })
        .catch((error) => {
          throw new ExternalError({ status: error.code, message: error.message, body: error.body });
        });
    };

  createCart: (account?: Account, businessUnitKey?: string, storeKey?: string) => Promise<Cart> = async (
    account?: Account,
    businessUnitKey?: string,
    storeKey?: string,
  ) => {
    const locale = await this.getCommercetoolsLocal();

    const cartDraft: Writeable<CartDraft> = {
      currency: locale.currency,
      country: locale.country,
      locale: locale.language,
      store: {
        key: storeKey,
        typeId: 'store',
      },
      inventoryMode: 'ReserveOnOrder',
      customerId: account.accountId,
    };

    return await this.associateEndpoints(account, businessUnitKey)
      .carts()
      .post({
        queryArgs: {
          expand: [
            'lineItems[*].discountedPrice.includedDiscounts[*].discount',
            'discountCodes[*].discountCode',
            'paymentInfo.payments[*]',
          ],
        },
        body: cartDraft,
      })
      .execute()
      .then(async (response) => await this.buildCartWithAvailableShippingMethods(response.body, locale))
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  addToCart: (cart: Cart, lineItems: LineItem[], account?: Account, businessUnitKey?: string) => Promise<Cart> = async (
    cart: Cart,
    lineItems: LineItem[],
    account?: Account,
    businessUnitKey?: string,
  ) => {
    try {
      const locale = await this.getCommercetoolsLocal();

      const cartUpdate: CartUpdate = {
        version: +cart.cartVersion,
        actions: [],
      };

      lineItems.map((lineItem) => {
        cartUpdate.actions.push({
          action: 'addLineItem',
          sku: lineItem.variant.sku,
          quantity: +lineItem.count,
        });

        const oldLineItem = cart.lineItems?.find((li) => li.variant?.sku === lineItem.variant.sku);
        if (oldLineItem) {
          cartUpdate.actions.push({
            action: 'setLineItemShippingDetails',
            lineItemId: oldLineItem.lineItemId,
            shippingDetails: null,
          });
        }
      });

      const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale, account, businessUnitKey);

      return await this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
    } catch (error) {
      throw new ExternalError({
        status: 400,
        message: 'addToCart failed',
        body: `addToCart failed. ${error}`,
      });
    }
  };

  updateLineItem: (cart: Cart, lineItem: LineItem, account?: Account, businessUnitKey?: string) => Promise<Cart> =
    async (cart: Cart, lineItem: LineItem, account?: Account, businessUnitKey?: string) => {
      const locale = await this.getCommercetoolsLocal();

      const cartUpdate: CartUpdate = {
        version: +cart.cartVersion,
        actions: [
          {
            action: 'changeLineItemQuantity',
            lineItemId: lineItem.lineItemId,
            quantity: +lineItem.count,
          },
        ],
      };

      const oldLineItem = cart.lineItems?.find((li) => li.lineItemId === lineItem.lineItemId);
      if (oldLineItem) {
        cartUpdate.actions.push({
          action: 'setLineItemShippingDetails',
          lineItemId: oldLineItem.lineItemId,
          shippingDetails: null,
        });
      }

      const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale, account, businessUnitKey);

      return await this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
    };

  setCustomerId: (cart: Cart, customerId: string, account?: Account, businessUnitKey?: string) => Promise<Cart> =
    async (cart: Cart, customerId: string, account?: Account, businessUnitKey?: string) => {
      try {
        const locale = await this.getCommercetoolsLocal();

        const cartUpdate: CartUpdate = {
          version: +cart.cartVersion,
          actions: [
            {
              action: 'setCustomerId',
              customerId,
            } as CartSetCustomerIdAction,
          ],
        };

        const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale, account, businessUnitKey);

        return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
      } catch (error) {
        throw new ExternalError({
          status: 400,
          message: 'setCustomerId failed',
          body: `setCustomerId failed. ${error}`,
        });
      }
    };

  removeLineItem: (cart: Cart, lineItem: LineItem, account?: Account, businessUnitKey?: string) => Promise<Cart> =
    async (cart: Cart, lineItem: LineItem, account?: Account, businessUnitKey?: string) => {
      try {
        const locale = await this.getCommercetoolsLocal();

        const cartUpdate: CartUpdate = {
          version: +cart.cartVersion,
          actions: [
            {
              action: 'removeLineItem',
              lineItemId: lineItem.lineItemId,
            } as CartRemoveLineItemAction,
          ],
        };

        const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale, account, businessUnitKey);

        return await this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
      } catch (error) {
        throw new ExternalError({
          status: 400,
          message: 'setCustomerId failed',
          body: `setCustomerId failed. ${error}`,
        });
      }
    };

  order: (cart: Cart, account?: Account, businessUnitKey?: string, purchaseOrderNumber?: string) => Promise<Order> =
    async (cart: Cart, account?: Account, businessUnitKey?: string, purchaseOrderNumber?: string) => {
      const locale = await this.getCommercetoolsLocal();
      const date = new Date();

      const orderFromCartDraft: Writeable<OrderFromCartDraft> = {
        id: cart.cartId,
        version: +cart.cartVersion,
        orderNumber: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}-${String(Date.now()).slice(
          -6,
          -1,
        )}`,
        orderState: 'Confirmed',
      };
      if (purchaseOrderNumber) {
        orderFromCartDraft.purchaseOrderNumber = purchaseOrderNumber;
      }

      if (!isReadyForCheckout(cart)) {
        throw new Error('Cart not complete yet.');
      }

      return await this.associateEndpoints(account, businessUnitKey)
        .orders()
        .post({
          queryArgs: {
            expand: [
              'lineItems[*].discountedPrice.includedDiscounts[*].discount',
              'discountCodes[*].discountCode',
              'paymentInfo.payments[*]',
            ],
          },
          body: orderFromCartDraft,
        })
        .execute()
        .then((response) => CartMapper.commercetoolsOrderToOrder(response.body, locale))
        .catch((error) => {
          throw new ExternalError({ status: error.code, message: error.message, body: error.body });
        });
    };

  getOrders: (account: Account) => Promise<Order[]> = async (account: Account) => {
    const locale = await this.getCommercetoolsLocal();

    return await this.associateEndpoints(account)
      .orders()
      .get({
        queryArgs: {
          expand: [
            'lineItems[*].discountedPrice.includedDiscounts[*].discount',
            'discountCodes[*].discountCode',
            'paymentInfo.payments[*]',
            'state',
          ],
          where: `customerId="${account.accountId}"`,
          sort: 'createdAt desc',
        },
      })
      .execute()
      .then((response) => response.body.results.map((order) => CartMapper.commercetoolsOrderToOrder(order, locale)))
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  getOrder: (orderId: string, account?: Account) => Promise<Order> = async (orderId: string, account?: Account) => {
    const locale = await this.getCommercetoolsLocal();

    return await this.associateEndpoints(account)
      .orders()
      .withOrderNumber({ orderNumber: orderId })
      .get({
        queryArgs: {
          expand: [
            'lineItems[*].discountedPrice.includedDiscounts[*].discount',
            'discountCodes[*].discountCode',
            'paymentInfo.payments[*]',
            'state',
          ],
        },
      })
      .execute()
      .then((response) => CartMapper.commercetoolsOrderToOrder(response.body, locale))
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  updateOrderState: (
    orderId: string,
    orderState: string,
    account?: Account,
    businessUnitKey?: string,
  ) => Promise<Order> = async (orderId: string, orderState: string, account?: Account, businessUnitKey?: string) => {
    const locale = await this.getCommercetoolsLocal();

    return await this.getOrder(orderId).then((order) => {
      if (order.orderState === OrderState.Complete) {
        throw 'Cannot cancel a Completed order.';
      }
      return this.associateEndpoints(account, businessUnitKey)
        .orders()
        .withOrderNumber({ orderNumber: orderId })
        .post({
          body: {
            version: +order.orderVersion,
            actions: [
              {
                action: 'changeOrderState',
                orderState,
              },
            ],
          },
          queryArgs: {
            expand: [
              'lineItems[*].discountedPrice.includedDiscounts[*].discount',
              'discountCodes[*].discountCode',
              'paymentInfo.payments[*]',
            ],
          },
        })
        .execute()
        .then((response) => CartMapper.commercetoolsOrderToOrder(response.body, locale))
        .catch((error) => {
          throw new ExternalError({ status: error.code, message: error.message, body: error.body });
        });
    });
  };

  returnItems: (
    orderId: string,
    returnLineItems: ReturnLineItem[],
    account?: Account,
    businessUnitKey?: string,
  ) => Promise<Order> = async (
    orderId: string,
    returnLineItems: ReturnLineItem[],
    account?: Account,
    businessUnitKey?: string,
  ) => {
    const locale = await this.getCommercetoolsLocal();
    const returnItems = CartMapper.returnLineItemToCommercetoolsReturnItemDraft(returnLineItems);

    return await this.getOrder(orderId).then((order) => {
      return this.associateEndpoints(account, businessUnitKey)
        .orders()
        .withOrderNumber({ orderNumber: orderId })
        .post({
          body: {
            version: +order.orderVersion,
            actions: [
              {
                action: 'addReturnInfo',
                items: returnItems,
                returnDate: new Date().toISOString(),
                returnTrackingId: new Date().getTime().toString(),
              },
            ],
          },
        })
        .execute()
        .then((response) => CartMapper.commercetoolsOrderToOrder(response.body, locale))
        .catch((error) => {
          throw new ExternalError({ status: error.code, message: error.message, body: error.body });
        });
    });
  };

  getBusinessUnitOrders: (businessUnitKey: string, account?: Account) => Promise<Order[]> = async (
    businessUnitKey: string,
    account?: Account,
  ) => {
    const locale = await this.getCommercetoolsLocal();

    const endpoint = account
      ? this.requestBuilder()
          .asAssociate()
          .withAssociateIdValue({ associateId: account.accountId })
          .inBusinessUnitKeyWithBusinessUnitKeyValue({ businessUnitKey: businessUnitKey })
      : this.requestBuilder();

    return await endpoint
      .orders()
      .get({
        queryArgs: {
          expand: ['state'],
          where: `businessUnit(key="${businessUnitKey}")`,
          sort: 'createdAt desc',
        },
      })
      .execute()
      .then((response) => response.body.results.map((order) => CartMapper.commercetoolsOrderToOrder(order, locale)))
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  freezeCart: (cart: Cart, account?: Account) => Promise<Cart> = async (cart: Cart, account?: Account) => {
    try {
      const locale = await this.getCommercetoolsLocal();

      const cartUpdate: CartUpdate = {
        version: +cart.cartVersion,
        actions: [
          {
            action: 'freezeCart',
          },
        ],
      };

      const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale, account);

      return await this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
    } catch (error) {
      throw new ExternalError({
        status: 400,
        message: `freeze error failed`,
        body: `freeze error failed. ${error}`,
      });
    }
  };

  assertCartForBusinessUnitAndStore: (cart: Cart, businessUnitKey?: string, storeKey?: string) => boolean = (
    cart: Cart,
    businessUnitKey?: string,
    storeKey?: string,
  ) => {
    return (
      !!cart.businessUnitKey &&
      !!cart.storeKey &&
      cart.businessUnitKey === businessUnitKey &&
      cart.storeKey === storeKey
    );
  };

  unfreezeCart: (cart: Cart, account?: Account) => Promise<Cart> = async (cart: Cart, account?: Account) => {
    try {
      const locale = await this.getCommercetoolsLocal();

      const cartUpdate: CartUpdate = {
        version: +cart.cartVersion,
        actions: [
          {
            action: 'unfreezeCart',
          },
        ],
      };
      const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale, account);

      return await this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
    } catch (error) {
      throw new ExternalError({
        status: 400,
        message: `freeze error failed`,
        body: `freeze error failed. ${error}`,
      });
    }
  };

  setCustomType: (cart: Cart, type: string, fields: any, account?: Account) => Promise<Cart> = async (
    cart: Cart,
    type: string,
    fields: any,
    account?: Account,
  ) => {
    try {
      const locale = await this.getCommercetoolsLocal();

      const cartUpdate: CartUpdate = {
        version: +cart.cartVersion,
        actions: [
          {
            action: 'setCustomType',
            type: {
              typeId: 'type',
              key: type,
            },
            fields,
          },
        ],
      };
      const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate, locale, account);

      return await this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
    } catch (error) {
      throw new ExternalError({
        status: 400,
        message: `freeze error failed`,
        body: `freeze error failed. ${error}`,
      });
    }
  };

  replicateCart: (orderId: string, account?: Account, businessUnitKey?: string) => Promise<Cart> = async (
    orderId: string,
    account?: Account,
    businessUnitKey?: string,
  ) => {
    const locale = await this.getCommercetoolsLocal();
    return await this.associateEndpoints(account, businessUnitKey)
      .carts()
      .replicate()
      .post({
        body: {
          reference: {
            id: orderId,
            typeId: 'order',
          },
        },
      })
      .execute()
      .then(async (response) => await this.buildCartWithAvailableShippingMethods(response.body, locale))
      .catch((error) => {
        throw new ExternalError({ status: 400, message: error.message, body: error.body });
      });
  };

  deleteCart: (cart: Cart, account?: Account) => Promise<void> = async (cart: Cart, account?: Account) => {
    await this.associateEndpoints(account)
      .carts()
      .withId({
        ID: cart.cartId,
      })
      .delete({
        queryArgs: {
          version: parseInt(cart.cartVersion, 10),
        },
      })
      .execute();
  };

  splitLineItem: (
    cart: Cart,
    lineItemId: string,
    shippingAddresses?: { address: Address; count: number }[],
    account?: Account,
    businessUnitKey?: string,
  ) => Promise<Cart> = async (
    cart: Cart,
    lineItemId: string,
    shippingAddresses?: { address: Address; count: number }[],
    account?: Account,
    businessUnitKey?: string,
  ) => {
    const locale = await this.getCommercetoolsLocal();

    const cartItemsShippingAddresses = cart.itemShippingAddresses || [];
    const remainingAddresses = shippingAddresses
      .map((shippingAddress) => shippingAddress.address)
      .filter(
        (addressSplit) =>
          cartItemsShippingAddresses.findIndex((address: Address) => address.addressId === addressSplit.addressId) ===
          -1,
      );

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [],
    };

    if (remainingAddresses.length) {
      remainingAddresses.map((address) => {
        const cartAddItemShippingAddressAction: CartAddItemShippingAddressAction = {
          action: 'addItemShippingAddress',
          address: AccountMapper.addressToCommercetoolsAddress(address),
        };

        cartUpdate.actions.push(cartAddItemShippingAddressAction);
      });
    }

    if (shippingAddresses.length) {
      const targets: ItemShippingTarget[] = shippingAddresses.map((shippingAddress) => ({
        addressKey: shippingAddress.address.addressId,
        quantity: shippingAddress.count,
      }));

      const cartSetLineItemShippingDetailsAction: CartSetLineItemShippingDetailsAction = {
        action: 'setLineItemShippingDetails',
        lineItemId,
        shippingDetails: {
          targets: targets,
        },
      };

      cartUpdate.actions.push(cartSetLineItemShippingDetailsAction);
    }

    if (cartUpdate.actions.length) {
      const commercetoolsCart = await this.updateCart(
        cart.cartId,
        cartUpdate,
        locale,
        account,

        businessUnitKey,
      );

      cart = await this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
    }

    return cart;
  };

  async queryOrders(orderQuery: OrderQuery): Promise<PaginatedResult<Order>> {
    const locale = await this.getCommercetoolsLocal();
    const limit = +orderQuery.limit || undefined;
    const sortAttributes: string[] = [];

    if (orderQuery.sortAttributes !== undefined) {
      Object.keys(orderQuery.sortAttributes).map((field, directionIndex) => {
        sortAttributes.push(`${field} ${Object.values(orderQuery.sortAttributes)[directionIndex]}`);
      });
    } else {
      // default sort
      sortAttributes.push(`lastModifiedAt desc`);
    }

    const whereClause = [`customerId="${orderQuery.accountId}"`];
    if (orderQuery.orderIds !== undefined && orderQuery.orderIds.length !== 0) {
      whereClause.push(`orderNumber in ("${orderQuery.orderIds.join('","')}")`);
    }
    if (orderQuery.orderState !== undefined && orderQuery.orderState.length > 0) {
      whereClause.push(`orderState in ("${orderQuery.orderState.join('","')}")`);
    }

    if (orderQuery.businessUnitKey !== undefined) {
      whereClause.push(`businessUnit(key="${orderQuery.businessUnitKey}")`);
    }

    const searchQuery = orderQuery.query && orderQuery.query;

    return this.requestBuilder()
      .orders()
      .get({
        queryArgs: {
          where: whereClause,
          expand: ['orderState'],
          limit: limit,
          offset: getOffsetFromCursor(orderQuery.cursor),
          sort: sortAttributes,
          [`text.${locale.language}`]: searchQuery,
        },
      })
      .execute()
      .then((response) => {
        const orders = response.body.results.map((commercetoolsQuote) => {
          return CartMapper.commercetoolsOrderToOrder(commercetoolsQuote, locale);
        });

        return {
          total: response.body.total,
          items: orders,
          count: response.body.count,
          previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, response.body.count),
          nextCursor: ProductMapper.calculateNextCursor(response.body.offset, response.body.count, response.body.total),
          query: orderQuery,
        };
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  }

  protected associateEndpoints: (
    account?: Account,
    businessUnitKey?: string,
  ) =>
    | ByProjectKeyAsAssociateByAssociateIdInBusinessUnitKeyByBusinessUnitKeyRequestBuilder
    | ByProjectKeyRequestBuilder = (account?: Account, businessUnitKey?: string) => {
    return account && businessUnitKey
      ? this.requestBuilder()
          .asAssociate()
          .withAssociateIdValue({ associateId: account.accountId })
          .inBusinessUnitKeyWithBusinessUnitKeyValue({
            businessUnitKey: businessUnitKey,
          })
      : this.requestBuilder();
  };

  protected assertCorrectLocale: (
    commercetoolsCart: CommercetoolsCart,
    locale: Locale,
    account?: Account,
  ) => Promise<Cart> = async (commercetoolsCart: CommercetoolsCart, locale: Locale, account?: Account) => {
    if (commercetoolsCart.totalPrice.currencyCode !== locale.currency.toLocaleUpperCase()) {
      return this.recreate(commercetoolsCart, locale);
    }

    if (this.doesCartNeedLocaleUpdate(commercetoolsCart, locale)) {
      const cartUpdate: CartUpdate = {
        version: commercetoolsCart.version,
        actions: [
          {
            action: 'setCountry',
            country: locale.country,
          } as CartSetCountryAction,
          {
            action: 'setLocale',
            country: locale.language,
          } as CartSetLocaleAction,
        ],
      };

      commercetoolsCart = await this.updateCart(commercetoolsCart.id, cartUpdate, locale, account);

      return CartMapper.commercetoolsCartToCart(commercetoolsCart, locale) as Cart;
    }

    return CartMapper.commercetoolsCartToCart(commercetoolsCart, locale) as Cart;
  };

  protected recreate: (
    primaryCommercetoolsCart: CommercetoolsCart,
    locale: Locale,
    account?: Account,
  ) => Promise<Cart> = async (primaryCommercetoolsCart: CommercetoolsCart, locale: Locale, account?: Account) => {
    const lineItems = primaryCommercetoolsCart.lineItems;

    const cartDraft: CartDraft = {
      currency: locale.currency,
      country: locale.country,
      locale: locale.language,
    };

    // TODO: implement a logic that hydrate cartDraft with commercetoolsCart
    // for (const key of Object.keys(commercetoolsCart)) {
    //   if (cartDraft.hasOwnProperty(key) && cartDraft[key] !== undefined) {
    //     cartDraft[key] = commercetoolsCart[key];
    //   }
    // }

    const propertyList = [
      'customerId',
      'customerEmail',
      'customerGroup',
      'anonymousId',
      'store',
      'inventoryMode',
      'taxMode',
      'taxRoundingMode',
      'taxCalculationMode',
      'shippingAddress',
      'billingAddress',
      'shippingMethod',
      'externalTaxRateForShippingMethod',
      'deleteDaysAfterLastModification',
      'origin',
      'shippingRateInput',
      'itemShippingAddresses',
    ];

    for (const key of propertyList) {
      if (primaryCommercetoolsCart.hasOwnProperty(key)) {
        cartDraft[key] = primaryCommercetoolsCart[key];
      }
    }

    let replicatedCommercetoolsCart = await this.associateEndpoints(account)
      .carts()
      .post({
        queryArgs: {
          expand: [
            'lineItems[*].discountedPrice.includedDiscounts[*].discount',
            'discountCodes[*].discountCode',
            'paymentInfo.payments[*]',
          ],
        },
        body: cartDraft,
      })
      .execute()
      .then((response) => {
        return response.body;
      });

    // Add line items to the replicated cart one by one to handle the exception
    // if an item is not available on the new currency.
    for (const lineItem of lineItems) {
      try {
        const cartUpdate: CartUpdate = {
          version: +replicatedCommercetoolsCart.version,
          actions: [
            {
              action: 'addLineItem',
              sku: lineItem.variant.sku,
              quantity: +lineItem.quantity,
            },
          ],
        };

        replicatedCommercetoolsCart = await this.updateCart(
          replicatedCommercetoolsCart.id,
          cartUpdate,
          locale,
          account,
        );
      } catch (error) {
        // Ignore that a line item could not be added due to missing price, etc
      }
    }

    const primaryCart: Cart = {
      cartId: primaryCommercetoolsCart.id,
      cartVersion: primaryCommercetoolsCart.version.toString(),
    };

    // Delete previous cart
    await this.deleteCart(primaryCart);

    return CartMapper.commercetoolsCartToCart(replicatedCommercetoolsCart, locale);
  };

  protected async updateCart(
    cartId: string,
    cartUpdate: CartUpdate,
    locale: Locale,
    account?: Account,
    businessUnitKey?: string,
  ): Promise<CommercetoolsCart> {
    return await this.associateEndpoints(account, businessUnitKey)
      .carts()
      .withId({
        ID: cartId,
      })
      .post({
        queryArgs: {
          expand: [
            'lineItems[*].discountedPrice.includedDiscounts[*].discount',
            'discountCodes[*].discountCode',
            'paymentInfo.payments[*]',
          ],
        },
        body: cartUpdate,
      })
      .execute()
      .then((response) => {
        return response.body;
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  }
}
