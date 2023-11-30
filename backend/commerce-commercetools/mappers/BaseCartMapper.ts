import { Cart } from '@Types/cart/Cart';
import {
  BaseAddress as CommercetoolsAddress,
  Cart as CommercetoolsCart,
  DiscountCodeInfo as CommercetoolsDiscountCodeInfo,
  DiscountedLineItemPriceForQuantity as CommercetoolsDiscountedLineItemPriceForQuantity,
  DiscountedLineItemPortion as CommercetoolsDiscountedLineItemPortion,
  LineItem as CommercetoolsLineItem,
  Order as CommercetoolsOrder,
  Payment as CommercetoolsPayment,
  PaymentInfo as CommercetoolsPaymentInfo,
  ShippingInfo as CommercetoolsShippingInfo,
  ShippingMethod as CommercetoolsShippingMethod,
  TaxedPrice as CommercetoolsTaxedPrice,
  ZoneRate as CommercetoolsZoneRate,
} from '@commercetools/platform-sdk';
import { LineItem } from '@Types/cart/LineItem';
import { Order } from '@Types/cart/Order';
import { Address } from '@Types/account/Address';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';
import { ShippingMethod } from '@Types/cart/ShippingMethod';
import { ShippingRate } from '@Types/cart/ShippingRate';
import { ShippingLocation } from '@Types/cart/ShippingLocation';
import { ProductRouter } from '../utils/ProductRouter';
import { ProductMapper } from './ProductMapper';
import { ShippingInfo } from '@Types/cart/ShippingInfo';
import { Payment } from '@Types/cart/Payment';
import { Tax } from '@Types/cart/Tax';
import { TaxPortion } from '@Types/cart/TaxPortion';
import { Discount } from '@Types/cart/Discount';

export class BaseCartMapper {
  static commercetoolsCartToCart(commercetoolsCart: CommercetoolsCart, locale: Locale): Cart {
    return {
      cartId: commercetoolsCart.id,
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
        //@ts-expect-error
        taxedPrice: ProductMapper.commercetoolsMoneyToMoney(commercetoolsLineItem.taxedPrice?.totalGross),
        variant: ProductMapper.commercetoolsProductVariantToVariant(commercetoolsLineItem.variant, locale),
        isGift:
          commercetoolsLineItem?.lineItemMode !== undefined && commercetoolsLineItem.lineItemMode === 'GiftLineItem',
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
      cartId: commercetoolsOrder.id,
      orderState: commercetoolsOrder.orderState,
      orderId: commercetoolsOrder.orderNumber,
      orderVersion: commercetoolsOrder.version.toString(),
      // createdAt:
      lineItems: this.commercetoolsLineItemsToLineItems(commercetoolsOrder.lineItems, locale),
      email: commercetoolsOrder?.customerEmail,
      shippingAddress: this.commercetoolsAddressToAddress(commercetoolsOrder.shippingAddress),
      billingAddress: this.commercetoolsAddressToAddress(commercetoolsOrder.billingAddress),
      sum: ProductMapper.commercetoolsMoneyToMoney(commercetoolsOrder.totalPrice),
      //sum: commercetoolsOrder.totalPrice.centAmount,
      // payments:
      // discountCodes:
      // taxed:
    } as Order;
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
          discountTexts.push(commercetoolsDiscountedLineItemPortion.discount.obj?.name[locale.language]);
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

    if (commercetoolsDiscountedLineItemPortion.discount.obj) {
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
}
