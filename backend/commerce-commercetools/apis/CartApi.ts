import { Cart, CartOrigin, CartState } from '@Types/cart/Cart';
import { LineItem } from '@Types/cart/LineItem';
import { Address } from '@Types/account/Address';
import { Order, OrderState, ReturnLineItem } from '@Types/cart/Order';
import {
  Cart as CommercetoolsCart,
  Order as CommercetoolsOrder,
  RecurringOrder as CommercetoolsRecurringOrder,
  CartAddPaymentAction,
  CartDraft,
  CartRemoveDiscountCodeAction,
  CartSetBillingAddressAction,
  CartSetShippingAddressAction,
  CartSetShippingMethodAction,
  OrderFromCartDraft,
  OrderUpdate,
  RecurringOrderUpdate,
  RecurringOrderUpdateAction,
} from '@commercetools/platform-sdk';
import {
  CartAddDiscountCodeAction,
  CartAddItemShippingAddressAction,
  CartRemoveLineItemAction,
  CartSetCountryAction,
  CartSetCustomerEmailAction,
  CartSetCustomerIdAction,
  CartSetLineItemShippingDetailsAction,
  CartSetLocaleAction,
  CartUpdate,
  ItemShippingTarget,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/cart';
import { OrderQuery } from '@Types/query/OrderQuery';
import { PaginatedResult } from '@Types/result';
import { DiscountCode, Payment, RecurrencePolicy, RecurringOrder, ShippingMethod } from '@Types/cart';
import {
  PaymentDraft,
  PaymentUpdateAction,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/payment';
import { Context, Request } from '@frontastic/extension-types';
import { Token } from '@Types/Token';
import { RecurrencePolicyQuery, RecurringOrderQuery } from '@Types/query';
import { PriceSelectionMode } from '@Types/cart/RecurrencePolicy';
import CartMapper from '../mappers/CartMapper';
import { isReadyForCheckout } from '../utils/Cart';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';
import AccountMapper from '@Commerce-commercetools/mappers/AccountMapper';
import ProductMapper from '@Commerce-commercetools/mappers/ProductMapper';
import { getOffsetFromCursor } from '@Commerce-commercetools/utils/Pagination';
import BaseApi from '@Commerce-commercetools/apis/BaseApi';
import { CartPaymentNotFoundError } from '@Commerce-commercetools/errors/CartPaymentNotFoundError';
import { CartRedeemDiscountCodeError } from '@Commerce-commercetools/errors/CartRedeemDiscountCodeError';
import { CartNotCompleteError } from '@Commerce-commercetools/errors/CartNotCompleteError';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';
import getBusinessUnitApi from '@Commerce-commercetools/utils/apiFactories/getBusinessUnitApi';

const CART_EXPANDS = [
  'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount',
  'lineItems[*].price.discounted.discount',
  'lineItems[*].recurrenceInfo.recurrencePolicy',
  'discountCodes[*].discountCode',
  'discountOnTotalPrice.includedDiscounts[*].discount',
  'discountCodes[*].discountCode.cartDiscounts[*]',
  'paymentInfo.payments[*]',
  'shippingInfo.discountedPrice.includedDiscounts[*].discount',
  'customerGroup',
];
const ORDER_EXPANDS = [...CART_EXPANDS, 'orderState', 'recurringOrder'];
const RECURRING_ORDER_EXPANDS = ['customer'];
const SHIPPING_METHOD_EXPANDS = ['zoneRates[*].zone'];

export default class CartApi extends BaseApi {
  protected accountId: string;
  protected businessUnitKey: string;
  protected storeKey: string;
  protected distributionChannelId: string;
  protected supplyChannelId: string;
  protected request: Request;

  constructor(
    context: Context,
    locale: string | null,
    currency: string | null,
    accountId?: string,
    businessUnitKey?: string,
    distributionChannelId?: string,
    supplyChannelId?: string,
    request?: Request | null,
  ) {
    super(context, locale, currency, request);
    this.accountId = accountId;
    this.businessUnitKey = businessUnitKey;
    this.distributionChannelId = distributionChannelId;
    this.supplyChannelId = supplyChannelId;
    this.request = request;
  }

  async getById(cartId: string): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    return await this.associateEndpoints(this.accountId, this.businessUnitKey)
      .carts()
      .withId({
        ID: cartId,
      })
      .get({
        queryArgs: {
          limit: 1,
          expand: CART_EXPANDS,
        },
      })
      .execute()
      .then((response) => {
        return this.buildCartWithAvailableShippingMethods(response.body, locale);
      })
      .catch((error) => {
        // The 400 error is thrown when the cart doesn't belong to the associate or the business unit
        // The 404 error is thrown when the cart can't be found
        if (error.statusCode === 400 || error.statusCode === 404) {
          throw new ResourceNotFoundError({ message: error.message });
        }

        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async getActiveCartInStore(storeKey: string): Promise<Cart | undefined> {
    this.invalidateSessionCheckoutData();

    const locale = await this.getCommercetoolsLocal();

    const allCarts = await this.getAllActiveCartsInStore(storeKey);

    if (allCarts.length >= 1) {
      const cart = await this.buildCartWithAvailableShippingMethods(allCarts[0], locale);
      if (this.assertCartForBusinessUnitAndStore(cart, this.businessUnitKey, storeKey)) {
        return cart;
      }
    }

    return undefined;
  }

  async getAllActiveCartsInStore(storeKey: string): Promise<CommercetoolsCart[]> {
    const where = [
      `cartState="Active"`,
      `store(key="${storeKey}")`,
      `customerId="${this.accountId}"`,
      `origin in ("${CartOrigin.Customer}", "${CartOrigin.Merchant}")`,
    ];

    return await this.associateEndpoints(this.accountId, this.businessUnitKey)
      .carts()
      .get({
        queryArgs: {
          limit: 15,
          expand: CART_EXPANDS,
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
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async createCartInStore(storeKey: string): Promise<Cart> {
    this.invalidateSessionCheckoutData();

    const locale = await this.getCommercetoolsLocal();

    const cartDraft: CartDraft = {
      currency: locale.currency,
      country: locale.country,
      locale: locale.language,
      store: {
        key: storeKey,
        typeId: 'store',
      },
      inventoryMode: 'ReserveOnOrder',
      customerId: this.accountId,
    };

    return await this.associateEndpoints(this.accountId, this.businessUnitKey)
      .carts()
      .post({
        queryArgs: {
          expand: CART_EXPANDS,
        },
        body: cartDraft,
      })
      .execute()
      .then(async (response) => await this.buildCartWithAvailableShippingMethods(response.body, locale))
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async addToCart(cart: Cart, lineItems: LineItem[]): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();
    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [],
    };

    lineItems.map((lineItem) => {
      const recurrencePolicy = lineItem?.recurrenceInfo?.recurrencePolicy;
      cartUpdate.actions.push({
        action: 'addLineItem',
        ...(this.distributionChannelId && {
          distributionChannel: { typeId: 'channel', id: this.distributionChannelId },
        }),
        ...(this.supplyChannelId && {
          supplyChannel: { typeId: 'channel', id: this.supplyChannelId },
        }),
        sku: lineItem.variant.sku,
        quantity: +lineItem.count,
        ...(lineItem?.recurrenceInfo &&
          recurrencePolicy?.recurrencePolicyId && {
            recurrenceInfo: {
              recurrencePolicy: {
                typeId: 'recurrence-policy',
                id: recurrencePolicy.recurrencePolicyId,
              },
              priceSelectionMode: PriceSelectionMode.Fixed,
            },
          }),
      });
    });

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return await this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async updateLineItem(cart: Cart, lineItem: LineItem): Promise<Cart> {
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

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return await this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async setCustomerId(cart: Cart, customerId: string): Promise<Cart> {
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

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async removeLineItem(cart: Cart, lineItem: LineItem): Promise<Cart> {
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

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return await this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async setEmail(cart: Cart, email: string): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'setCustomerEmail',
          email: email,
        } as CartSetCustomerEmailAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async setShippingAddress(cart: Cart, address: Address): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'setShippingAddress',
          address: CartMapper.addressToCommercetoolsAddress(address),
        } as CartSetShippingAddressAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async setBillingAddress(cart: Cart, address: Address): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'setBillingAddress',
          address: CartMapper.addressToCommercetoolsAddress(address),
        } as CartSetBillingAddressAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async setShippingMethod(cart: Cart, shippingMethod: ShippingMethod): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'setShippingMethod',
          shippingMethod: {
            typeId: 'shipping-method',
            id: shippingMethod.shippingMethodId,
          },
        } as CartSetShippingMethodAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async order(cart: Cart, purchaseOrderNumber?: string): Promise<Order> {
    const locale = await this.getCommercetoolsLocal();
    const date = new Date();

    const orderFromCartDraft: OrderFromCartDraft = {
      cart: {
        typeId: 'cart',
        id: cart.cartId,
      },
      version: +cart.cartVersion,
      orderNumber: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${String(Date.now()).slice(-6, -1)}`,
      purchaseOrderNumber: purchaseOrderNumber !== undefined ? purchaseOrderNumber : undefined,
    };

    if (!isReadyForCheckout(cart)) {
      throw new CartNotCompleteError({ message: 'Cart not complete yet.' });
    }

    return await this.associateEndpoints(this.accountId, this.businessUnitKey)
      .orders()
      .post({
        queryArgs: {
          expand: ORDER_EXPANDS,
        },
        body: orderFromCartDraft,
      })
      .execute()
      .then((response) => CartMapper.commercetoolsOrderToOrder(response.body, locale, this.defaultLocale))
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async getOrder(orderId: string): Promise<Order> {
    const locale = await this.getCommercetoolsLocal();

    return await this.associateEndpoints(this.accountId, this.businessUnitKey)
      .orders()
      .withId({ ID: orderId })
      .get({
        queryArgs: {
          expand: ORDER_EXPANDS,
        },
      })
      .execute()
      .then((response) => CartMapper.commercetoolsOrderToOrder(response.body, locale, this.defaultLocale))
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async updateOrderState(orderId: string, orderState: string): Promise<Order> {
    const locale = await this.getCommercetoolsLocal();

    return await this.getOrder(orderId).then(async (order) => {
      if (order.orderState === OrderState.Complete) {
        throw 'Cannot cancel a Completed order.';
      }

      return this.associateEndpoints(this.accountId, this.businessUnitKey)
        .orders()
        .withId({ ID: orderId })
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
            expand: ORDER_EXPANDS,
          },
        })
        .execute()
        .then((response) => CartMapper.commercetoolsOrderToOrder(response.body, locale, this.defaultLocale))
        .catch((error) => {
          throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
        });
    });
  }

  async returnItems(orderId: string, returnLineItems: ReturnLineItem[]): Promise<Order> {
    const locale = await this.getCommercetoolsLocal();
    const returnItems = CartMapper.returnLineItemToCommercetoolsReturnItemDraft(returnLineItems);

    return await this.getOrder(orderId).then(async (order) => {
      return this.associateEndpoints(this.accountId, this.businessUnitKey)
        .orders()
        .withId({ ID: orderId })
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
          queryArgs: {
            expand: ORDER_EXPANDS,
          },
        })
        .execute()
        .then((response) => CartMapper.commercetoolsOrderToOrder(response.body, locale, this.defaultLocale))
        .catch((error) => {
          throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
        });
    });
  }

  async getShippingMethods(onlyMatching: boolean): Promise<ShippingMethod[]> {
    const locale = await this.getCommercetoolsLocal();

    const methodArgs = {
      queryArgs: {
        expand: SHIPPING_METHOD_EXPANDS,
        country: onlyMatching ? locale.country : undefined,
      },
    };

    let requestBuilder = this.requestBuilder().shippingMethods().get(methodArgs);

    if (onlyMatching) {
      requestBuilder = this.requestBuilder().shippingMethods().matchingLocation().get(methodArgs);
    }

    return await requestBuilder
      .execute()
      .then((response) => {
        return response.body.results.map((shippingMethod) =>
          CartMapper.commercetoolsShippingMethodToShippingMethod(shippingMethod, locale, this.defaultLocale),
        );
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async getAvailableShippingMethods(cart: Cart): Promise<ShippingMethod[]> {
    const locale = await this.getCommercetoolsLocal();

    return await this.requestBuilder()
      .shippingMethods()
      .matchingCart()
      .get({
        queryArgs: {
          expand: SHIPPING_METHOD_EXPANDS,
          cartId: cart.cartId,
        },
      })
      .execute()
      .then((response) => {
        return response.body.results.map((shippingMethod) =>
          CartMapper.commercetoolsShippingMethodToShippingMethod(shippingMethod, locale, this.defaultLocale),
        );
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async addPayment(cart: Cart, payment: Payment): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    // TODO: create and use custom a payment field to include details for the payment integration

    const paymentDraft: PaymentDraft = {
      key: payment.id,
      amountPlanned: {
        centAmount: payment.amountPlanned.centAmount,
        currencyCode: payment.amountPlanned.currencyCode,
      },
      interfaceId: payment.paymentId,
      paymentMethodInfo: {
        paymentInterface: payment.paymentProvider,
        method: payment.paymentMethod,
      },
      paymentStatus: {
        interfaceCode: payment.paymentStatus,
        interfaceText: payment.debug,
      },
    };

    const paymentResponse = await this.requestBuilder()
      .payments()
      .post({
        body: paymentDraft,
      })
      .execute();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'addPayment',
          payment: {
            typeId: 'payment',
            id: paymentResponse.body.id,
          },
        } as CartAddPaymentAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async updatePayment(cart: Cart, payment: Payment): Promise<Payment> {
    const originalPayment = cart.payments.find((cartPayment) => cartPayment.id === payment.id);

    if (originalPayment === undefined) {
      throw new CartPaymentNotFoundError({ message: `Payment ${payment.id} not found in cart ${cart.cartId}` });
    }

    const paymentUpdateActions: PaymentUpdateAction[] = [];

    if (payment.paymentStatus) {
      paymentUpdateActions.push({
        action: 'setStatusInterfaceCode',
        interfaceCode: payment.paymentStatus,
      });
    }

    if (payment.debug) {
      paymentUpdateActions.push({
        action: 'setStatusInterfaceText',
        interfaceText: payment.debug,
      });
    }

    if (payment.paymentId) {
      paymentUpdateActions.push({
        action: 'setInterfaceId',
        interfaceId: payment.paymentId,
      });
    }

    if (paymentUpdateActions.length === 0) {
      // There is nothing to be updated
      return payment;
    }

    return await this.requestBuilder()
      .payments()
      .withKey({
        key: originalPayment.id,
      })
      .post({
        body: {
          version: originalPayment.version,
          actions: paymentUpdateActions,
        },
      })
      .execute()
      .then((response) => {
        return CartMapper.commercetoolsPaymentToPayment(response.body);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async getPayment(paymentId: string) {
    return await this.requestBuilder()
      .payments()
      .withId({
        ID: paymentId,
      })
      .get()
      .execute();
  }

  async updateOrderPayment(paymentId: string, paymentDraft: Payment) {
    const paymentUpdateActions: PaymentUpdateAction[] = [];

    if (paymentDraft.paymentMethod) {
      paymentUpdateActions.push({
        action: 'setMethodInfoMethod',
        method: paymentDraft.paymentMethod,
      });
    }

    if (paymentDraft.amountPlanned) {
      paymentUpdateActions.push({
        action: 'changeAmountPlanned',
        amount: {
          centAmount: paymentDraft.amountPlanned.centAmount,
          currencyCode: paymentDraft.amountPlanned.currencyCode,
        },
      });
    }

    if (paymentDraft.paymentStatus) {
      paymentUpdateActions.push({
        action: 'setStatusInterfaceCode',
        interfaceCode: paymentDraft.paymentStatus,
      });
    }

    return await this.requestBuilder()
      .payments()
      .withId({
        ID: paymentId,
      })
      .post({
        body: {
          version: paymentDraft.version,
          actions: paymentUpdateActions,
        },
      })
      .execute()
      .then((response) => {
        return CartMapper.commercetoolsPaymentToPayment(response.body);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async redeemDiscountCode(cart: Cart, code: string): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'addDiscountCode',
          code: code,
        } as CartAddDiscountCodeAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate)
      .then((commercetoolsCart) => {
        const commercetoolsDiscountCode = commercetoolsCart.discountCodes.find(
          (discountCode) => discountCode.discountCode?.obj.code === code,
        );

        if (commercetoolsDiscountCode.state !== 'MatchesCart') {
          // Remove the discount code if status is different than MatchesCart
          const cartUpdate: CartUpdate = {
            version: +commercetoolsCart.version,
            actions: [
              {
                action: 'removeDiscountCode',
                discountCode: {
                  typeId: 'discount-code',
                  id: commercetoolsDiscountCode.discountCode.id,
                },
              } as CartRemoveDiscountCodeAction,
            ],
          };

          this.updateCart(commercetoolsCart.id, cartUpdate);

          throw new CartRedeemDiscountCodeError({
            message: `Redeem discount code '${code}' failed with state '${commercetoolsDiscountCode.state}'`,
            statusCode: 409,
          });
        }

        return commercetoolsCart;
      })
      .catch((error) => {
        if (error instanceof ExternalError) {
          throw new CartRedeemDiscountCodeError({
            message: `Redeem discount code '${code}' failed. ${error.message}`,
            statusCode: error.statusCode,
          });
        }

        throw error;
      });

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async removeDiscountCode(cart: Cart, discount: DiscountCode): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'removeDiscountCode',
          discountCode: {
            typeId: 'discount-code',
            id: discount.discountCodeId,
          },
        } as CartRemoveDiscountCodeAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  assertCartForBusinessUnitAndStore(cart: Cart, businessUnitKey?: string, storeKey?: string): boolean {
    return (
      !!cart.businessUnitKey &&
      !!cart.storeKey &&
      cart.businessUnitKey === businessUnitKey &&
      cart.storeKey === storeKey
    );
  }

  assertCartIsActive(cart: Cart): boolean {
    return cart.cartState === CartState.Active;
  }

  assertCartOrigin(cart: Cart): boolean {
    return cart.origin === CartOrigin.Customer || cart.origin === CartOrigin.Merchant;
  }

  async replicateCart(orderId: string): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();
    return await this.associateEndpoints(this.accountId, this.businessUnitKey)
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
        throw new ExternalError({ statusCode: 400, message: error.message, body: error.body });
      });
  }

  async deleteCart(cart: Cart): Promise<void> {
    await this.associateEndpoints(this.accountId, this.businessUnitKey)
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
  }

  async splitLineItem(
    cart: Cart,
    lineItemId: string,
    shippingAddresses?: { address: Address; count: number }[],
  ): Promise<Cart> {
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
      const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

      cart = await this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
    }

    return cart;
  }

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

    const whereClause: string[] = [];

    if (orderQuery.accountId !== undefined) {
      whereClause.push(`customerId="${orderQuery.accountId}"`);
    }

    if (orderQuery.orderIds !== undefined && orderQuery.orderIds.length !== 0) {
      whereClause.push(`id in ("${orderQuery.orderIds.join('","')}")`);
    }

    if (orderQuery.orderNumbers !== undefined && orderQuery.orderNumbers.length !== 0) {
      whereClause.push(`orderNumber in ("${orderQuery.orderNumbers.join('","')}")`);
    }

    if (orderQuery.orderState !== undefined && orderQuery.orderState.length > 0) {
      whereClause.push(`orderState in ("${orderQuery.orderState.join('","')}")`);
    }

    if (orderQuery.shipmentState !== undefined && orderQuery.shipmentState.length > 0) {
      whereClause.push(`shipmentState in ("${orderQuery.shipmentState.join('","')}")`);
    }

    if (orderQuery.businessUnitKey !== undefined) {
      whereClause.push(`businessUnit(key="${orderQuery.businessUnitKey}")`);
    }

    if (orderQuery.created?.from !== undefined) {
      whereClause.push(`createdAt > "${orderQuery.created.from.toISOString()}"`);
    }

    if (orderQuery.created?.to !== undefined) {
      whereClause.push(`createdAt < "${orderQuery.created.to.toISOString()}"`);
    }

    const queryResult = await this.associateEndpoints(this.accountId, this.businessUnitKey)
      .orders()
      .get({
        queryArgs: {
          where: whereClause,
          expand: ORDER_EXPANDS,
          limit: limit,
          offset: getOffsetFromCursor(orderQuery.cursor),
          sort: sortAttributes,
          [`text.${locale.language}`]: orderQuery.query,
        },
      })
      .execute()
      .then((response) => {
        const orders = response.body.results.map((commercetoolsOrder) => {
          return CartMapper.commercetoolsOrderToOrder(commercetoolsOrder, locale, this.defaultLocale);
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
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });

    const businessUnitApi = getBusinessUnitApi(this.request, this.commercetoolsFrontendContext);

    const approvalFlows = await businessUnitApi.queryApprovalFlows(this.businessUnitKey, this.accountId, {
      orderIds: queryResult.items.map((order) => order.orderId),
    });

    queryResult.items.forEach((order) => {
      const approvalFlow = approvalFlows.items.find((approvalFlow) => approvalFlow.order.orderId === order.orderId);
      if (approvalFlow) {
        order.approvalFlowStatus = approvalFlow.approvalFlowStatus;
      }
    });

    return queryResult;
  }

  async getCheckoutSessionToken(cartId: string): Promise<Token> {
    return await this.generateCheckoutSessionToken(cartId);
  }

  async getRecurrencePolicies(
    recurrencePolicyQuery: RecurrencePolicyQuery,
  ): Promise<PaginatedResult<RecurrencePolicy>> {
    const locale = await this.getCommercetoolsLocal();
    const limit = +recurrencePolicyQuery.limit || undefined;
    const whereClause: string[] = [];

    if (
      recurrencePolicyQuery.recurrencePolicyIds !== undefined &&
      recurrencePolicyQuery.recurrencePolicyIds.length !== 0
    ) {
      whereClause.push(`id in ("${recurrencePolicyQuery.recurrencePolicyIds.join('","')}")`);
    }

    if (recurrencePolicyQuery.keys !== undefined && recurrencePolicyQuery.keys.length !== 0) {
      whereClause.push(`key in ("${recurrencePolicyQuery.keys.join('","')}")`);
    }

    return await this.requestBuilder()
      .recurrencePolicies()
      .get({
        queryArgs: {
          limit,
          where: whereClause,
        },
      })
      .execute()
      .then((response) => {
        const recurrencePolicies = response.body.results.map((recurrencePolicy) => {
          return CartMapper.commercetoolsRecurrencePolicyToRecurrencePolicy(
            recurrencePolicy,
            locale,
            this.defaultLocale,
          );
        });
        return {
          total: response.body.total,
          items: recurrencePolicies,
          count: response.body.count,
          previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, response.body.count),
          nextCursor: ProductMapper.calculateNextCursor(response.body.offset, response.body.count, response.body.total),
          query: recurrencePolicyQuery,
        };
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async queryRecurringOrders(recurringOrderQuery: RecurringOrderQuery): Promise<PaginatedResult<RecurringOrder>> {
    const limit = +recurringOrderQuery.limit || undefined;
    const sortAttributes: string[] = [];
    const whereClause: string[] = [`customer(id="${this.accountId}")`];

    const recurringOrderQuerySort = recurringOrderQuery.sortAttributes;

    if (recurringOrderQuerySort && Object.keys(recurringOrderQuerySort).length > 0) {
      Object.entries(recurringOrderQuerySort).forEach(([field, direction]) => {
        sortAttributes.push(`${field} ${direction}`);
      });
    } else {
      sortAttributes.push('createdAt desc');
    }

    if (recurringOrderQuery.recurringOrderIds !== undefined && recurringOrderQuery.recurringOrderIds.length !== 0) {
      whereClause.push(`id in ("${recurringOrderQuery.recurringOrderIds.join('","')}")`);
    }

    if (recurringOrderQuery.recurringOrderStates !== undefined && recurringOrderQuery.recurringOrderStates.length > 0) {
      whereClause.push(`recurringOrderState in ("${recurringOrderQuery.recurringOrderStates.join('","')}")`);
    }

    if (recurringOrderQuery.businessUnitKey !== undefined) {
      whereClause.push(`businessUnit(key="${recurringOrderQuery.businessUnitKey}")`);
    }

    if (recurringOrderQuery.startsAt !== undefined) {
      whereClause.push(`startsAt="${recurringOrderQuery.startsAt}"`);
    }

    if (recurringOrderQuery.createdAt !== undefined) {
      whereClause.push(`createdAt="${recurringOrderQuery.createdAt}"`);
    }

    return await this.requestBuilder()
      .recurringOrders()
      .get({
        queryArgs: {
          limit,
          where: whereClause,
          sort: sortAttributes,
          expand: RECURRING_ORDER_EXPANDS,
        },
      })
      .execute()
      .then((response) => {
        const recurringOrders = response.body.results.map((recurringOrders) => {
          return CartMapper.commercetoolsRecurringOrderToRecurringOrder(recurringOrders);
        });
        return {
          total: response.body.total,
          items: recurringOrders,
          count: response.body.count,
          previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, response.body.count),
          nextCursor: ProductMapper.calculateNextCursor(response.body.offset, response.body.count, response.body.total),
          query: recurringOrderQuery,
        };
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async pauseRecurringOrder(recurringOrderId: string): Promise<RecurringOrder> {
    try {
      return this.updateRecurringOrder(recurringOrderId, [
        {
          action: 'setRecurringOrderState',
          recurringOrderState: {
            type: 'paused',
          },
        },
      ])
        .then((commercetoolsRecurringOrder) => {
          return CartMapper.commercetoolsRecurringOrderToRecurringOrder(commercetoolsRecurringOrder);
        })
        .catch((error) => {
          throw new ExternalError({
            statusCode: error.statusCode,
            message: error.message,
            body: error.body,
          });
        });
    } catch (error) {
      throw error;
    }
  }

  async resumeRecurringOrder(recurringOrderId: string): Promise<RecurringOrder> {
    try {
      return this.updateRecurringOrder(recurringOrderId, [
        {
          action: 'setRecurringOrderState',
          recurringOrderState: {
            type: 'active',
          },
        },
      ]).then((commercetoolsRecurringOrder) => {
        return CartMapper.commercetoolsRecurringOrderToRecurringOrder(commercetoolsRecurringOrder);
      });
    } catch (error) {
      throw error;
    }
  }

  async cancelRecurringOrder(recurringOrderId: string): Promise<RecurringOrder> {
    try {
      return this.updateRecurringOrder(recurringOrderId, [
        {
          action: 'setRecurringOrderState',
          recurringOrderState: {
            type: 'canceled',
          },
        },
      ]).then((commercetoolsRecurringOrder) => {
        return CartMapper.commercetoolsRecurringOrderToRecurringOrder(commercetoolsRecurringOrder);
      });
    } catch (error) {
      throw error;
    }
  }

  async skipRecurringOrder(recurringOrderId: string): Promise<RecurringOrder> {
    return this.updateRecurringOrder(recurringOrderId, [
      {
        action: 'setOrderSkipConfiguration',
        skipConfiguration: {
          type: 'counter',
          totalToSkip: 1,
        },
      },
    ])
      .then((commercetoolsRecurringOrder) => {
        return CartMapper.commercetoolsRecurringOrderToRecurringOrder(commercetoolsRecurringOrder);
      })
      .catch((error) => {
        throw new ExternalError({
          statusCode: error.statusCode,
          message: error.message,
          body: error.body,
        });
      });
  }

  protected async setOrderNumber(order: Order): Promise<Order> {
    const locale = await this.getCommercetoolsLocal();

    // By default, the order number is generated using the order creation date
    const date = new Date(order.createdAt);
    const orderNumber = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${String(Date.now()).slice(-6, -1)}`;

    const orderUpdate: OrderUpdate = {
      version: +order.orderVersion,
      actions: [
        {
          action: 'setOrderNumber',
          orderNumber,
        },
      ],
    };

    const commercetoolsOrder = await this.updateOrder(order.orderId, orderUpdate);

    return CartMapper.commercetoolsOrderToOrder(commercetoolsOrder, locale, this.defaultLocale);
  }

  protected async assertCorrectLocale(commercetoolsCart: CommercetoolsCart, locale: Locale): Promise<Cart> {
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
            locale: locale.language,
          } as CartSetLocaleAction,
        ],
      };

      commercetoolsCart = await this.updateCart(commercetoolsCart.id, cartUpdate);
    }

    return CartMapper.commercetoolsCartToCart(
      commercetoolsCart,
      locale,
      this.defaultLocale,
      this.supplyChannelId,
    ) as Cart;
  }

  protected async recreate(primaryCommercetoolsCart: CommercetoolsCart, locale: Locale): Promise<Cart> {
    const lineItems = primaryCommercetoolsCart.lineItems;

    const cartDraft: CartDraft = {
      currency: locale.currency,
      country: locale.country,
      locale: locale.language,
    };

    const propertyList = [
      'customerEmail',
      'store',
      'inventoryMode',
      'taxMode',
      'taxRoundingMode',
      'taxCalculationMode',
      'deleteDaysAfterLastModification',
      'origin',
    ];

    // Commercetools cart only accepts customerId or anonymousId
    primaryCommercetoolsCart.customerId !== undefined
      ? propertyList.push('customerId')
      : propertyList.push('anonymousId');

    for (const key of propertyList) {
      if (primaryCommercetoolsCart.hasOwnProperty(key)) {
        cartDraft[key] = primaryCommercetoolsCart[key];
      }
    }

    let replicatedCommercetoolsCart = await this.associateEndpoints(this.accountId, this.businessUnitKey)
      .carts()
      .post({
        queryArgs: {
          expand: CART_EXPANDS,
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
      if (lineItem.lineItemMode === 'GiftLineItem') {
        // If the line item is a gift, we don't need to add it to the cart
        continue;
      }

      try {
        const cartUpdate: CartUpdate = {
          version: +replicatedCommercetoolsCart.version,
          actions: [
            {
              action: 'addLineItem',
              ...(this.distributionChannelId && {
                distributionChannel: { typeId: 'channel', id: this.distributionChannelId },
              }),
              ...(this.supplyChannelId && {
                supplyChannel: { typeId: 'channel', id: this.supplyChannelId },
              }),
              sku: lineItem.variant.sku,
              quantity: +lineItem.quantity,
            },
          ],
        };

        replicatedCommercetoolsCart = await this.updateCart(replicatedCommercetoolsCart.id, cartUpdate);
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

    return CartMapper.commercetoolsCartToCart(
      replicatedCommercetoolsCart,
      locale,
      this.defaultLocale,
      this.supplyChannelId,
    );
  }

  protected async updateCart(cartId: string, cartUpdate: CartUpdate): Promise<CommercetoolsCart> {
    return await this.associateEndpoints(this.accountId, this.businessUnitKey)
      .carts()
      .withId({
        ID: cartId,
      })
      .post({
        queryArgs: {
          expand: CART_EXPANDS,
        },
        body: cartUpdate,
      })
      .execute()
      .then((response) => {
        return response.body;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  protected async updateOrder(orderId: string, orderUpdate: OrderUpdate): Promise<CommercetoolsOrder> {
    return await this.associateEndpoints(this.accountId, this.businessUnitKey)
      .orders()
      .withId({
        ID: orderId,
      })
      .post({
        queryArgs: {
          expand: ORDER_EXPANDS,
        },
        body: orderUpdate,
      })
      .execute()
      .then((response) => {
        return response.body;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  protected async buildCartWithAvailableShippingMethods(
    commercetoolsCart: CommercetoolsCart,
    locale: Locale,
  ): Promise<Cart> {
    const cart = await this.assertCorrectLocale(commercetoolsCart, locale);

    // It would not be possible to get available shipping method
    // if the shipping address has not been set.
    if (cart.shippingAddress !== undefined && cart.shippingAddress.country !== undefined) {
      cart.availableShippingMethods = await this.getAvailableShippingMethods(cart);
    }

    return cart;
  }

  protected doesCartNeedLocaleUpdate(commercetoolsCart: CommercetoolsCart, locale: Locale): boolean {
    if (commercetoolsCart.country === undefined) {
      return true;
    }

    if (commercetoolsCart.locale === undefined) {
      return true;
    }

    return commercetoolsCart.country !== locale.country || commercetoolsCart.locale !== locale.language;
  }

  protected async updateRecurringOrder(
    recurringOrderId: string,
    recurringOrderUpdateActions: RecurringOrderUpdateAction[],
  ): Promise<CommercetoolsRecurringOrder> {
    return this.queryRecurringOrders({ recurringOrderIds: [recurringOrderId] })
      .then((result) => {
        const recurringOrder = result.items[0];

        if (!recurringOrder) {
          throw new ResourceNotFoundError({
            message: `Recurring order with ID ${recurringOrderId} not found`,
          });
        }

        const recurringOrderUpdate: RecurringOrderUpdate = {
          version: +recurringOrder.recurringOrderVersion,
          actions: recurringOrderUpdateActions,
        };

        return this.requestBuilder()
          .recurringOrders()
          .withId({ ID: recurringOrderId })
          .post({
            body: recurringOrderUpdate,
            queryArgs: { expand: RECURRING_ORDER_EXPANDS },
          })
          .execute();
      })
      .then((response) => response.body)
      .catch((error) => {
        throw new ExternalError({
          statusCode: error.statusCode,
          message: error.message,
          body: error.body,
        });
      });
  }
}
