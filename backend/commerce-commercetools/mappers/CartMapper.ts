import {
  Cart as CommercetoolsCart,
  CartDiscountReference,
  CartOrigin as CommercetoolsCartOrigin,
  LineItem as CommercetoolsLineItem,
  Order as CommercetoolsOrder,
  Reference,
  ReturnItemDraft,
} from '@commercetools/platform-sdk';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';
import { ProductMapper } from './ProductMapper';
import { ProductRouter } from '../utils/ProductRouter';
import { LineItem, LineItemShippingAddress } from '@Types/cart/LineItem';
import { Cart, CartOrigin } from '@Types/cart/Cart';
import { Order, OrderState, ReturnInfo, ReturnLineItem, ShipmentState } from '@Types/cart/Order';
import {
  LineItemReturnItem,
  OrderState as CommercetoolsOrderState,
  PaymentInfo as CommercetoolsPaymentInfo,
  ReturnInfo as CommercetoolsReturnInfo,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/order';
import { BaseAddress as CommercetoolsAddress } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/common';
import { Address } from '@Types/account';
import {
  DiscountCodeInfo as CommercetoolsDiscountCodeInfo,
  DiscountedLineItemPortion as CommercetoolsDiscountedLineItemPortion,
  DiscountedLineItemPriceForQuantity as CommercetoolsDiscountedLineItemPriceForQuantity,
  ShippingInfo as CommercetoolsShippingInfo,
  TaxedPrice as CommercetoolsTaxedPrice,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/cart';
import {
  Discount,
  Payment,
  ShippingInfo,
  ShippingLocation,
  ShippingMethod,
  ShippingRate,
  Tax,
  TaxPortion,
} from '@Types/cart';
import {
  ShippingMethod as CommercetoolsShippingMethod,
  ZoneRate as CommercetoolsZoneRate,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/shipping-method';
import { Payment as CommercetoolsPayment } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/payment';

export class CartMapper {
  static commercetoolsCartToCart(commercetoolsCart: CommercetoolsCart, locale: Locale): Cart {
    return {
      cartId: commercetoolsCart.id,
      accountId: commercetoolsCart.customerId,
      cartVersion: commercetoolsCart.version.toString(),
      lineItems: this.commercetoolsLineItemsToLineItems(commercetoolsCart.lineItems, locale),
      email: commercetoolsCart?.customerEmail,
      sum: ProductMapper.commercetoolsMoneyToMoney(commercetoolsCart.totalPrice),
      shippingAddress: this.commercetoolsAddressToAddress(commercetoolsCart.shippingAddress),
      billingAddress: this.commercetoolsAddressToAddress(commercetoolsCart.billingAddress),
      shippingInfo: this.commercetoolsShippingInfoToShippingInfo(commercetoolsCart.shippingInfo, locale),
      payments: this.commercetoolsPaymentInfoToPayments(commercetoolsCart.paymentInfo, locale),
      discountCodes: this.commercetoolsDiscountCodesInfoToDiscountCodes(commercetoolsCart.discountCodes, locale),
      taxed: this.commercetoolsTaxedPriceToTaxed(commercetoolsCart.taxedPrice, locale),
      itemShippingAddresses: commercetoolsCart.itemShippingAddresses,
      origin: this.commercetoolsCartOriginToCartOrigin(commercetoolsCart.origin),
      businessUnitKey: commercetoolsCart.businessUnit?.key,
      storeKey: commercetoolsCart.store?.key,
    };
  }

  static commercetoolsLineItemsToLineItems(
    commercetoolsLineItems: CommercetoolsLineItem[],
    locale: Locale,
  ): LineItem[] {
    const lineItems: LineItem[] = [];

    commercetoolsLineItems?.forEach((commercetoolsLineItem) => {
      const item: LineItem = {
        lineItemId: commercetoolsLineItem.id,
        productId: commercetoolsLineItem.productId,
        name: commercetoolsLineItem?.name[locale.language] || '',
        type: 'variant',
        count: commercetoolsLineItem.quantity,
        price: ProductMapper.commercetoolsMoneyToMoney(commercetoolsLineItem.price?.value),
        discountedPrice: ProductMapper.commercetoolsMoneyToMoney(commercetoolsLineItem.price?.discounted?.value),
        discountTexts: this.commercetoolsDiscountedPricesPerQuantityToDiscountTexts(
          commercetoolsLineItem.discountedPricePerQuantity,
          locale,
        ),
        discounts: this.commercetoolsDiscountedPricesPerQuantityToDiscounts(
          commercetoolsLineItem.discountedPricePerQuantity,
          locale,
        ),
        totalPrice: ProductMapper.commercetoolsMoneyToMoney(commercetoolsLineItem.totalPrice),
        variant: ProductMapper.commercetoolsProductVariantToVariant(commercetoolsLineItem.variant, locale),
        isGift:
          commercetoolsLineItem?.lineItemMode !== undefined && commercetoolsLineItem.lineItemMode === 'GiftLineItem',
        shippingDetails: {
          shippingAddresses: commercetoolsLineItem.shippingDetails?.targets?.map((commercetoolsItemShippingTarget) => {
            const lineItemShippingAddress: LineItemShippingAddress = {
              count: commercetoolsItemShippingTarget.quantity,
              addressKey: commercetoolsItemShippingTarget.addressKey,
            };
            return lineItemShippingAddress;
          }),
          valid: commercetoolsLineItem.shippingDetails?.valid,
        },
      };
      item._url = ProductRouter.generateUrlFor(item);
      lineItems.push(item);
    });

    return lineItems;
  }

  static commercetoolsAddressToAddress(commercetoolsAddress: CommercetoolsAddress): Address {
    return {
      addressId: commercetoolsAddress?.id,
      key: commercetoolsAddress?.key,
      salutation: commercetoolsAddress?.salutation,
      firstName: commercetoolsAddress?.firstName,
      lastName: commercetoolsAddress?.lastName,
      streetName: commercetoolsAddress?.streetName,
      streetNumber: commercetoolsAddress?.streetNumber,
      additionalStreetInfo: commercetoolsAddress?.additionalStreetInfo,
      additionalAddressInfo: commercetoolsAddress?.additionalAddressInfo,
      postalCode: commercetoolsAddress?.postalCode,
      city: commercetoolsAddress?.city,
      country: commercetoolsAddress?.country,
      state: commercetoolsAddress?.state,
      phone: commercetoolsAddress?.phone,
    } as Address;
  }

  static commercetoolsShipmentStateToShipmentState(commercetoolsShipmentState: string): ShipmentState {
    let shipmentState: ShipmentState;

    switch (true) {
      case commercetoolsShipmentState === 'Backorder':
        shipmentState = ShipmentState.Backorder;
        break;
      case commercetoolsShipmentState === 'Delayed':
        shipmentState = ShipmentState.Delayed;
        break;
      case commercetoolsShipmentState === 'Delivered':
        shipmentState = ShipmentState.Delivered;
        break;
      case commercetoolsShipmentState === 'Partial':
        shipmentState = ShipmentState.Partial;
        break;
      case commercetoolsShipmentState === 'Pending':
        shipmentState = ShipmentState.Pending;
        break;
      case commercetoolsShipmentState === 'Ready':
        shipmentState = ShipmentState.Ready;
        break;
      default:
        shipmentState = ShipmentState.Shipped;
        break;
    }

    return shipmentState;
  }

  static addressToCommercetoolsAddress(address: Address): CommercetoolsAddress {
    return {
      addressId: address?.addressId,
      salutation: address?.salutation,
      firstName: address?.firstName,
      lastName: address?.lastName,
      streetName: address?.streetName,
      streetNumber: address?.streetNumber,
      additionalStreetInfo: address?.additionalStreetInfo,
      additionalAddressInfo: address?.additionalAddressInfo,
      postalCode: address?.postalCode,
      city: address?.city,
      country: address?.country,
      state: address?.state,
      phone: address?.phone,
    } as CommercetoolsAddress;
  }

  static commercetoolsOrderToOrder(commercetoolsOrder: CommercetoolsOrder, locale: Locale): Order {
    return {
      cartId: commercetoolsOrder.cart?.id,
      accountId: commercetoolsOrder.customerId,
      origin: this.commercetoolsCartOriginToCartOrigin(commercetoolsOrder.origin),
      orderState: this.commercetoolsOrderStateToOrderState(commercetoolsOrder.orderState),
      orderId: commercetoolsOrder.id,
      orderNumber: commercetoolsOrder.orderNumber,
      orderVersion: commercetoolsOrder.version.toString(),
      lineItems: this.commercetoolsLineItemsToLineItems(commercetoolsOrder.lineItems, locale),
      email: commercetoolsOrder?.customerEmail,
      shippingAddress: this.commercetoolsAddressToAddress(commercetoolsOrder.shippingAddress),
      billingAddress: this.commercetoolsAddressToAddress(commercetoolsOrder.billingAddress),
      sum: ProductMapper.commercetoolsMoneyToMoney(commercetoolsOrder.totalPrice),
      businessUnitKey: commercetoolsOrder.businessUnit?.key,
      storeKey: commercetoolsOrder.store?.key,
      createdAt: new Date(commercetoolsOrder.createdAt),
      shippingInfo: this.commercetoolsShippingInfoToShippingInfo(commercetoolsOrder.shippingInfo, locale),
      returnInfo: this.commercetoolsReturnInfoToReturnInfo(commercetoolsOrder.returnInfo),
      shipmentState: this.commercetoolsShipmentStateToShipmentState(commercetoolsOrder.shipmentState),
      // state: this.commercetoolsOrderStateToState(commercetoolsOrder.state, locale),
    };
  }

  static commercetoolsShippingInfoToShippingInfo(
    commercetoolsShippingInfo: CommercetoolsShippingInfo | undefined,
    locale: Locale,
  ): ShippingInfo | undefined {
    if (commercetoolsShippingInfo === undefined) {
      return undefined;
    }

    let shippingMethod: ShippingMethod = {
      shippingMethodId: commercetoolsShippingInfo?.shippingMethod?.id,
    };

    if (commercetoolsShippingInfo.shippingMethod.obj) {
      shippingMethod = {
        ...this.commercetoolsShippingMethodToShippingMethod(commercetoolsShippingInfo.shippingMethod.obj, locale),
      };
    }

    return {
      ...shippingMethod,
      price: ProductMapper.commercetoolsMoneyToMoney(commercetoolsShippingInfo.price),
    };
  }

  static commercetoolsShippingMethodToShippingMethod(
    commercetoolsShippingMethod: CommercetoolsShippingMethod,
    locale: Locale,
  ): ShippingMethod {
    return {
      shippingMethodId: commercetoolsShippingMethod?.id || undefined,
      name:
        commercetoolsShippingMethod?.localizedName?.[locale.language] || commercetoolsShippingMethod?.name || undefined,
      description:
        commercetoolsShippingMethod?.localizedDescription?.[locale.language] ||
        commercetoolsShippingMethod?.description ||
        undefined,
      rates: this.commercetoolsZoneRatesToRates(commercetoolsShippingMethod?.zoneRates, locale),
    } as ShippingMethod;
  }

  static commercetoolsZoneRatesToRates(
    commercetoolsZoneRates: CommercetoolsZoneRate[] | undefined,
    locale: Locale,
  ): ShippingRate[] | undefined {
    if (commercetoolsZoneRates === undefined) {
      return undefined;
    }

    const shippingRates: ShippingRate[] = [];

    commercetoolsZoneRates.forEach((commercetoolsZoneRate) => {
      const shippingRateId = commercetoolsZoneRate.zone.id;
      const name = commercetoolsZoneRate.zone?.obj?.name || undefined;
      const locations = commercetoolsZoneRate.zone?.obj?.locations?.map((location) => {
        return {
          country: location.country,
          state: location.state,
        } as ShippingLocation;
      });

      // When we tried to get only matching shipping methods, `isMatching` value will be returned.
      // In those cases, we'll only map the ones with value `true`.
      const matchingShippingRates = commercetoolsZoneRate.shippingRates.filter(function (shippingRate) {
        if (shippingRate.isMatching !== undefined && shippingRate.isMatching !== true) {
          return false; // skip
        }
        return true;
      });

      matchingShippingRates.forEach((matchingShippingRates) => {
        shippingRates.push({
          shippingRateId: shippingRateId,
          name: name,
          locations: locations,
          price: ProductMapper.commercetoolsMoneyToMoney(matchingShippingRates.price),
        } as ShippingRate);
      });
    });

    return shippingRates;
  }

  static commercetoolsPaymentInfoToPayments(
    commercetoolsPaymentInfo: CommercetoolsPaymentInfo | undefined,
    locale: Locale,
  ): Payment[] {
    const payments: Payment[] = [];

    commercetoolsPaymentInfo?.payments?.forEach((commercetoolsPayment) => {
      if (commercetoolsPayment.obj) {
        payments.push(this.commercetoolsPaymentToPayment(commercetoolsPayment.obj, locale));
      }
    });

    return payments;
  }

  static commercetoolsPaymentToPayment(commercetoolsPayment: CommercetoolsPayment, locale: Locale): Payment {
    return {
      id: commercetoolsPayment.id ?? null,
      paymentId: commercetoolsPayment.interfaceId ?? null,
      paymentProvider: commercetoolsPayment.paymentMethodInfo.paymentInterface ?? null,
      paymentMethod: commercetoolsPayment.paymentMethodInfo.method ?? null,
      amountPlanned: ProductMapper.commercetoolsMoneyToMoney(commercetoolsPayment.amountPlanned),
      debug: JSON.stringify(commercetoolsPayment),
      paymentStatus: commercetoolsPayment.paymentStatus.interfaceCode ?? null,
      version: commercetoolsPayment.version ?? 0,
    };
  }

  static commercetoolsDiscountCodesInfoToDiscountCodes(
    commercetoolsDiscountCodesInfo: CommercetoolsDiscountCodeInfo[] | undefined,
    locale: Locale,
  ): Discount[] {
    const discounts: Discount[] = [];

    commercetoolsDiscountCodesInfo?.forEach((commercetoolsDiscountCodeInfo) => {
      discounts.push(this.commercetoolsDiscountCodeInfoToDiscountCode(commercetoolsDiscountCodeInfo, locale));
    });

    return discounts;
  }

  static commercetoolsDiscountCodeInfoToDiscountCode(
    commercetoolsDiscountCodeInfo: CommercetoolsDiscountCodeInfo,
    locale: Locale,
  ): Discount {
    let discount: Discount = {
      state: commercetoolsDiscountCodeInfo.state,
    };

    if (commercetoolsDiscountCodeInfo.discountCode.obj) {
      const commercetoolsDiscountCode = commercetoolsDiscountCodeInfo.discountCode.obj;

      discount = {
        ...discount,
        discountId: commercetoolsDiscountCode.id,
        code: commercetoolsDiscountCode.code,
        name: commercetoolsDiscountCode.name[locale.language] ?? undefined,
        description: commercetoolsDiscountCode.description[locale.language] ?? undefined,
      };
    }

    return discount;
  }

  static commercetoolsDiscountedPricesPerQuantityToDiscountTexts(
    commercetoolsDiscountedLineItemPricesForQuantity: CommercetoolsDiscountedLineItemPriceForQuantity[] | undefined,
    locale: Locale,
  ): string[] {
    const discountTexts: string[] = [];

    commercetoolsDiscountedLineItemPricesForQuantity?.forEach((commercetoolsDiscountedLineItemPriceForQuantity) => {
      commercetoolsDiscountedLineItemPriceForQuantity.discountedPrice.includedDiscounts.forEach(
        (commercetoolsDiscountedLineItemPortion) => {
          if (this.isCartDiscountReference(commercetoolsDiscountedLineItemPortion.discount)) {
            const discount = commercetoolsDiscountedLineItemPortion.discount;
            discountTexts.push(discount.obj.name[locale.language]);
          }
        },
      );
    });

    return discountTexts;
  }

  static commercetoolsDiscountedPricesPerQuantityToDiscounts(
    commercetoolsDiscountedLineItemPricesForQuantity: CommercetoolsDiscountedLineItemPriceForQuantity[] | undefined,
    locale: Locale,
  ): Discount[] {
    const discounts: Discount[] = [];

    commercetoolsDiscountedLineItemPricesForQuantity?.forEach((commercetoolsDiscountedLineItemPriceForQuantity) => {
      commercetoolsDiscountedLineItemPriceForQuantity.discountedPrice.includedDiscounts.forEach(
        (commercetoolsDiscountedLineItemPortion) => {
          discounts.push(
            this.commercetoolsDiscountedLineItemPortionToDiscount(commercetoolsDiscountedLineItemPortion, locale),
          );
        },
      );
    });

    return discounts;
  }

  static commercetoolsDiscountedLineItemPortionToDiscount(
    commercetoolsDiscountedLineItemPortion: CommercetoolsDiscountedLineItemPortion,
    locale: Locale,
  ): Discount {
    let discount: Discount = {
      discountedAmount: ProductMapper.commercetoolsMoneyToMoney(
        commercetoolsDiscountedLineItemPortion.discountedAmount,
      ),
    };

    if (this.isCartDiscountReference(commercetoolsDiscountedLineItemPortion.discount)) {
      const commercetoolsCartDiscount = commercetoolsDiscountedLineItemPortion.discount.obj;

      discount = {
        ...discount,
        discountId: commercetoolsCartDiscount.id,
        name: commercetoolsCartDiscount.name[locale.language] ?? undefined,
        description: commercetoolsCartDiscount.description[locale.language] ?? undefined,
      };
    }

    return discount;
  }

  static commercetoolsTaxedPriceToTaxed(
    commercetoolsTaxedPrice: CommercetoolsTaxedPrice | undefined,
    locale: Locale,
  ): Tax | undefined {
    if (commercetoolsTaxedPrice === undefined) {
      return undefined;
    }

    return {
      amount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxedPrice.totalNet),
      taxPortions: commercetoolsTaxedPrice.taxPortions.map((commercetoolsTaxPortion) => {
        const taxPortion: TaxPortion = {
          amount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxPortion.amount),
          name: commercetoolsTaxPortion.name,
          rate: commercetoolsTaxPortion.rate,
        };

        return taxPortion;
      }),
    };
  }

  static commercetoolsCartOriginToCartOrigin(commercetoolsCartOrigin: CommercetoolsCartOrigin): CartOrigin {
    let cartOrigin: CartOrigin;

    switch (true) {
      case commercetoolsCartOrigin === 'Merchant':
        cartOrigin = CartOrigin.Merchant;
        break;
      case commercetoolsCartOrigin === 'Quote':
        cartOrigin = CartOrigin.Quote;
        break;
      case commercetoolsCartOrigin === 'Customer':
      default:
        cartOrigin = CartOrigin.Customer;
        break;
    }

    return cartOrigin;
  }

  static commercetoolsOrderStateToOrderState(commercetoolsOrderState: CommercetoolsOrderState): OrderState {
    let orderState: OrderState;

    switch (true) {
      case commercetoolsOrderState === 'Cancelled':
        orderState = OrderState.Cancelled;
        break;
      case commercetoolsOrderState === 'Complete':
        orderState = OrderState.Complete;
        break;
      case commercetoolsOrderState === 'Confirmed':
        orderState = OrderState.Confirmed;
        break;
      case commercetoolsOrderState === 'Open':
      default:
        orderState = OrderState.Open;
        break;
    }

    return orderState;
  }

  static commercetoolsReturnInfoToReturnInfo(commercetoolsReturnInfo: CommercetoolsReturnInfo[]): ReturnInfo[] {
    return commercetoolsReturnInfo.map((returnInfo) => ({
      returnDate: new Date(returnInfo.returnDate),
      returnTrackingId: returnInfo.returnTrackingId,
      lineItems: returnInfo.items.map((returnItem) => ({
        returnLineItemId: returnItem.id,
        count: returnItem.quantity,
        lineItemId: (returnItem as LineItemReturnItem)?.lineItemId,
        comment: returnItem.comment,
        createdAt: new Date(returnItem.createdAt),
      })),
    }));
  }

  static returnLineItemToCommercetoolsReturnItemDraft(returnItem: ReturnLineItem[]): ReturnItemDraft[] {
    return returnItem.map((item) => ({
      quantity: item.count,
      lineItemId: item.lineItemId,
      shipmentState: 'Returned', //Initial state for Return Items that are refundable.
      comment: item?.comment,
    }));
  }

  static isCartDiscountReference(reference: Reference): reference is CartDiscountReference {
    return (reference as CartDiscountReference).obj !== undefined;
  }
}
