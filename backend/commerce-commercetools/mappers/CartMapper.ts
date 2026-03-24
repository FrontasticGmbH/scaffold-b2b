import {
  Cart as CommercetoolsCart,
  CartDiscountReference,
  CartOrigin as CommercetoolsCartOrigin,
  CartState as CommercetoolsCartState,
  LineItem as CommercetoolsLineItem,
  Order as CommercetoolsOrder,
  Reference,
  ReturnItemDraft,
  TaxRate as CommercetoolsTaxRate,
  DiscountOnTotalPrice as CommercetoolsDiscountOnTotalPrice,
  CartDiscountValue as CommercetoolsCartDiscountValue,
  DiscountCodeState as CommercetoolsDiscountCodeState,
  DiscountedTotalPricePortion as CommercetoolsDiscountedTotalPricePortion,
  DiscountedLineItemPrice as CommercetoolsDiscountedLineItemPrice,
  CartDiscount as CommercetoolsCartDiscount,
  DirectDiscount as CommercetoolsDirectDiscount,
  ShippingRate as CommercetoolsShippingRate,
  CartDiscountTarget as CommercetoolsCartDiscountTarget,
  SelectionMode as CommercetoolsSelectionMode,
} from '@commercetools/platform-sdk';
import { LineItem, LineItemShippingAddress } from '@Types/cart/LineItem';
import { Cart, CartOrigin, CartState } from '@Types/cart/Cart';
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
  TaxedItemPrice as CommercetoolsTaxedItemPrice,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/cart';
import {
  CartDiscount,
  CartDiscountValue,
  DiscountedPrice,
  DiscountedPortion,
  DiscountCodeState,
  DiscountOnTotalPrice,
  DiscountCode,
  DiscountedPricePerCount,
  Payment,
  ShippingInfo,
  ShippingLocation,
  ShippingMethod,
  ShippingRate,
  Tax,
  TaxPortion,
  TaxRate,
  DirectDiscount,
} from '@Types/cart';
import {
  ShippingMethod as CommercetoolsShippingMethod,
  ZoneRate as CommercetoolsZoneRate,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/shipping-method';
import { Payment as CommercetoolsPayment } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/payment';
import { CartDiscountSelectionMode, CartDiscountTarget } from '@Types/cart/Discount';
import ProductRouter from '../utils/routers/ProductRouter';
import ProductMapper from './ProductMapper';
import AccountMapper from './AccountMapper';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';
import LocalizedValue from '@Commerce-commercetools/utils/LocalizedValue';

export default class CartMapper {
  static commercetoolsCartToCart(
    commercetoolsCart: CommercetoolsCart,
    locale: Locale,
    defaultLocale: string,
    supplyChannelId?: string,
  ): Cart {
    return {
      cartId: commercetoolsCart.id,
      accountId: commercetoolsCart.customerId,
      cartVersion: commercetoolsCart.version.toString(),
      lineItems: this.commercetoolsLineItemsToLineItems(
        commercetoolsCart.lineItems,
        locale,
        defaultLocale,
        supplyChannelId,
      ),
      email: commercetoolsCart?.customerEmail,
      sum: ProductMapper.commercetoolsMoneyToMoney(commercetoolsCart.totalPrice),
      shippingAddress: this.commercetoolsAddressToAddress(commercetoolsCart.shippingAddress),
      billingAddress: this.commercetoolsAddressToAddress(commercetoolsCart.billingAddress),
      shippingInfo: this.commercetoolsShippingInfoToShippingInfo(commercetoolsCart.shippingInfo, locale, defaultLocale),
      payments: this.commercetoolsPaymentInfoToPayments(commercetoolsCart.paymentInfo),
      discountCodes: this.commercetoolsDiscountCodesInfoToDiscountCodes(
        commercetoolsCart.discountCodes,
        locale,
        defaultLocale,
      ),
      directDiscounts: this.commercetoolsDirectDiscountsToDirectDiscounts(commercetoolsCart.directDiscounts, locale),
      taxed: this.commercetoolsTaxedPriceToTaxed(commercetoolsCart.taxedPrice),
      itemShippingAddresses: commercetoolsCart.itemShippingAddresses,
      origin: this.commercetoolsCartOriginToCartOrigin(commercetoolsCart.origin),
      cartState: this.commercetoolsCartStateToCartState(commercetoolsCart.cartState),
      businessUnitKey: commercetoolsCart.businessUnit?.key,
      storeKey: commercetoolsCart.store?.key,
      discountOnTotalPrice: this.commerceToolsDiscountOnTotalPriceToDiscountOnTotalPrice(
        commercetoolsCart.discountOnTotalPrice,
        locale,
        defaultLocale,
      ),
      accountGroup: AccountMapper.commercetoolsCustomerGroupToAccountGroup(commercetoolsCart.customerGroup?.obj),
    };
  }

  static commerceToolsDiscountOnTotalPriceToDiscountOnTotalPrice(
    commerceToolsDiscountOnTotalPrice: CommercetoolsDiscountOnTotalPrice,
    locale: Locale,
    defaultLocale: string,
  ): DiscountOnTotalPrice | undefined {
    if (!commerceToolsDiscountOnTotalPrice) {
      return undefined;
    }

    return {
      discountedAmount: ProductMapper.commercetoolsMoneyToMoney(commerceToolsDiscountOnTotalPrice.discountedAmount),
      discountedGrossAmount: ProductMapper.commercetoolsMoneyToMoney(
        commerceToolsDiscountOnTotalPrice.discountedGrossAmount,
      ),
      discountedNetAmount: ProductMapper.commercetoolsMoneyToMoney(
        commerceToolsDiscountOnTotalPrice.discountedNetAmount,
      ),
      includedDiscounts: commerceToolsDiscountOnTotalPrice.includedDiscounts?.map((commercetoolsIncludedDiscount) => {
        return CartMapper.commercetoolsDiscountPortionToDiscountedPortion(
          commercetoolsIncludedDiscount,
          locale,
          defaultLocale,
        );
      }),
    };
  }

  static commercetoolsLineItemsToLineItems(
    commercetoolsLineItems: CommercetoolsLineItem[],
    locale: Locale,
    defaultLocale: string,
    supplyChannelId?: string,
  ): LineItem[] {
    const lineItems: LineItem[] = [];

    commercetoolsLineItems?.forEach((commercetoolsLineItem) => {
      const item: LineItem = {
        lineItemId: commercetoolsLineItem.id,
        productId: commercetoolsLineItem.productId,
        productSlug: commercetoolsLineItem.productSlug?.[locale.language],
        name: commercetoolsLineItem?.name[locale.language] || '',
        type: 'variant',
        count: commercetoolsLineItem.quantity,
        price: ProductMapper.commercetoolsMoneyToMoney(commercetoolsLineItem.price?.value),
        discountedPrice:
          commercetoolsLineItem.price?.discounted !== undefined
            ? ProductMapper.commercetoolsDiscountedPriceToDiscountedPrice(
                commercetoolsLineItem.price?.discounted,
                locale,
              )
            : undefined,
        discountedPricePerCount: this.commercetoolsDiscountedPricesPerQuantityToDiscountedPricePerCount(
          commercetoolsLineItem.discountedPricePerQuantity,
          locale,
          defaultLocale,
        ),
        totalPrice: ProductMapper.commercetoolsMoneyToMoney(commercetoolsLineItem.totalPrice),
        taxed: this.commercetoolsTaxedItemPriceToTaxed(commercetoolsLineItem.taxedPrice),
        taxRate: this.commercetoolsTaxRateToTaxRate(commercetoolsLineItem.taxRate),
        variant: ProductMapper.commercetoolsProductVariantToVariant(
          commercetoolsLineItem.variant,
          locale,
          supplyChannelId,
        ),
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

  static commercetoolsOrderToOrder(
    commercetoolsOrder: CommercetoolsOrder,
    locale: Locale,
    defaultLocale: string,
  ): Order {
    return {
      cartId: commercetoolsOrder.cart?.id,
      accountId: commercetoolsOrder.customerId,
      origin: this.commercetoolsCartOriginToCartOrigin(commercetoolsOrder.origin),
      orderState: this.commercetoolsOrderStateToOrderState(commercetoolsOrder.orderState),
      orderId: commercetoolsOrder.id,
      orderNumber: commercetoolsOrder.orderNumber,
      purchaseOrderNumber: this.getPurchaseOrderNumber(commercetoolsOrder),
      quoteId: commercetoolsOrder.quote?.id,
      orderVersion: commercetoolsOrder.version.toString(),
      lineItems: this.commercetoolsLineItemsToLineItems(commercetoolsOrder.lineItems, locale, defaultLocale),
      email: commercetoolsOrder?.customerEmail,
      shippingAddress: this.commercetoolsAddressToAddress(commercetoolsOrder.shippingAddress),
      billingAddress: this.commercetoolsAddressToAddress(commercetoolsOrder.billingAddress),
      sum: ProductMapper.commercetoolsMoneyToMoney(commercetoolsOrder.totalPrice),
      taxed: this.commercetoolsTaxedPriceToTaxed(commercetoolsOrder.taxedPrice),
      businessUnitKey: commercetoolsOrder.businessUnit?.key,
      storeKey: commercetoolsOrder.store?.key,
      createdAt: new Date(commercetoolsOrder.createdAt),
      shippingInfo: this.commercetoolsShippingInfoToShippingInfo(
        commercetoolsOrder.shippingInfo,
        locale,
        defaultLocale,
      ),
      returnInfo: this.commercetoolsReturnInfoToReturnInfo(commercetoolsOrder.returnInfo),
      shipmentState: this.commercetoolsShipmentStateToShipmentState(commercetoolsOrder.shipmentState),
      accountGroup: AccountMapper.commercetoolsCustomerGroupToAccountGroup(commercetoolsOrder.customerGroup?.obj),
    };
  }

  static commercetoolsShippingInfoToShippingInfo(
    commercetoolsShippingInfo: CommercetoolsShippingInfo | undefined,
    locale: Locale,
    defaultLocale: string,
  ): ShippingInfo | undefined {
    if (commercetoolsShippingInfo === undefined) {
      return undefined;
    }

    return {
      shippingMethodId: commercetoolsShippingInfo?.shippingMethod?.id,
      name: commercetoolsShippingInfo?.shippingMethodName,
      price: ProductMapper.commercetoolsMoneyToMoney(commercetoolsShippingInfo.price),
      rate: CartMapper.commercetoolsShippingRateToShippingRate(commercetoolsShippingInfo.shippingRate),
      taxRate: this.commercetoolsTaxRateToTaxRate(commercetoolsShippingInfo.taxRate),
      taxed: this.commercetoolsTaxedItemPriceToTaxed(commercetoolsShippingInfo.taxedPrice),
      discountedPrice: this.commercetoolsDiscountedLineItemPriceToDiscountedPrice(
        commercetoolsShippingInfo.discountedPrice,
        locale,
        defaultLocale,
      ),
    };
  }

  static commercetoolsShippingRateToShippingRate(commercetoolsShippingRate: CommercetoolsShippingRate): ShippingRate {
    return {
      price: ProductMapper.commercetoolsMoneyToMoney(commercetoolsShippingRate.price),
      freeAbove: ProductMapper.commercetoolsMoneyToMoney(commercetoolsShippingRate.freeAbove),
    };
  }

  static commercetoolsShippingMethodToShippingMethod(
    commercetoolsShippingMethod: CommercetoolsShippingMethod,
    locale: Locale,
    defaultLocale: string,
  ): ShippingMethod {
    return {
      shippingMethodId: commercetoolsShippingMethod?.id || undefined,
      name:
        LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsShippingMethod?.localizedName) ||
        undefined,
      description:
        LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsShippingMethod?.localizedDescription) ||
        undefined,
      rates: CartMapper.commercetoolsZoneRatesToRates(commercetoolsShippingMethod?.zoneRates),
    } as ShippingMethod;
  }

  static commercetoolsZoneRatesToRates(
    commercetoolsZoneRates: CommercetoolsZoneRate[] | undefined,
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
          freeAbove: ProductMapper.commercetoolsMoneyToMoney(matchingShippingRates.freeAbove),
        } as ShippingRate);
      });
    });

    return shippingRates;
  }

  static commercetoolsPaymentInfoToPayments(commercetoolsPaymentInfo: CommercetoolsPaymentInfo | undefined): Payment[] {
    const payments: Payment[] = [];

    commercetoolsPaymentInfo?.payments?.forEach((commercetoolsPayment) => {
      if (commercetoolsPayment.obj) {
        payments.push(this.commercetoolsPaymentToPayment(commercetoolsPayment.obj));
      }
    });

    return payments;
  }

  static commercetoolsPaymentToPayment(commercetoolsPayment: CommercetoolsPayment): Payment {
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
    defaultLocale: string,
  ): DiscountCode[] {
    const discounts: DiscountCode[] = [];

    commercetoolsDiscountCodesInfo?.forEach((commercetoolsDiscountCodeInfo) => {
      discounts.push(
        this.commercetoolsDiscountCodeInfoToDiscountCode(commercetoolsDiscountCodeInfo, locale, defaultLocale),
      );
    });

    return discounts;
  }

  static commercetoolsDirectDiscountsToDirectDiscounts(
    commercetoolsDirectDiscounts: CommercetoolsDirectDiscount[] | undefined,
    locale: Locale,
  ): DirectDiscount[] {
    return (
      commercetoolsDirectDiscounts
        // Filter out discounts for the target customLineItems as currently custom line items are not handled
        ?.filter((commercetoolsDirectDiscount) => commercetoolsDirectDiscount.target?.type === 'customLineItems')
        ?.map((commercetoolsDirectDiscount): DirectDiscount => {
          return {
            directDiscountId: commercetoolsDirectDiscount.id,
            discountValue: commercetoolsDirectDiscount.value
              ? this.commercetoolsCartDiscountValueToCartDiscountValue(commercetoolsDirectDiscount.value, locale)
              : undefined,
          };
        })
    );
  }

  static commercetoolsDiscountCodeInfoToDiscountCode(
    commercetoolsDiscountCodeInfo: CommercetoolsDiscountCodeInfo,
    locale: Locale,
    defaultLocale: string,
  ): DiscountCode {
    let discountCode: DiscountCode = {
      discountCodeId: commercetoolsDiscountCodeInfo.discountCode.id,
      state: this.commercetoolsDiscountCodeStateToDiscountCodeState(commercetoolsDiscountCodeInfo.state),
    };

    if (commercetoolsDiscountCodeInfo.discountCode.obj) {
      const commercetoolsDiscountCode = commercetoolsDiscountCodeInfo.discountCode.obj;

      discountCode = {
        ...discountCode,
        code: commercetoolsDiscountCode.code,
        name: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsDiscountCode.name) || undefined,
        description:
          LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsDiscountCode.description) || undefined,
        discounts: commercetoolsDiscountCode.cartDiscounts.map((commercetoolsCartDiscount) => {
          return {
            cartDiscountId: commercetoolsCartDiscount.id,
          };
        }),
      };
    }

    return discountCode;
  }

  static commercetoolsDiscountCodeStateToDiscountCodeState(
    commercetoolsDiscountCodeState: CommercetoolsDiscountCodeState,
  ): DiscountCodeState {
    let discountCodeState: DiscountCodeState;

    switch (true) {
      case commercetoolsDiscountCodeState === 'ApplicationStoppedByPreviousDiscount':
        discountCodeState = 'ApplicationStoppedByPreviousDiscount';
        break;
      case commercetoolsDiscountCodeState === 'DoesNotMatchCart':
        discountCodeState = 'DoesNotMatchCart';
        break;
      case commercetoolsDiscountCodeState === 'MatchesCart':
        discountCodeState = 'MatchesCart';
        break;
      case commercetoolsDiscountCodeState === 'MaxApplicationReached':
        discountCodeState = 'MaxApplicationReached';
        break;
      case commercetoolsDiscountCodeState === 'NotActive':
        discountCodeState = 'NotActive';
        break;
      case commercetoolsDiscountCodeState === 'NotValid':
      default:
        discountCodeState = 'NotValid';
        break;
    }

    return discountCodeState;
  }

  static commercetoolsDiscountPortionToDiscountedPortion(
    commercetoolsDiscountedPortion: CommercetoolsDiscountedTotalPricePortion | CommercetoolsDiscountedLineItemPortion,
    locale: Locale,
    defaultLocale: string,
  ): DiscountedPortion {
    let cartDiscount: CartDiscount = {
      cartDiscountId: commercetoolsDiscountedPortion.discount.id,
    };

    if (this.isCartDiscountReferenceExpanded(commercetoolsDiscountedPortion.discount)) {
      cartDiscount = this.commercetoolsCartDiscountToCartDiscount(
        commercetoolsDiscountedPortion.discount.obj,
        locale,
        defaultLocale,
      );
    }

    return {
      discountedAmount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsDiscountedPortion.discountedAmount),
      discount: cartDiscount,
    };
  }

  static commercetoolsCartDiscountToCartDiscount(
    commercetoolsCartDiscount: CommercetoolsCartDiscount,
    locale: Locale,
    defaultLocale: string,
  ): CartDiscount {
    return {
      cartDiscountId: commercetoolsCartDiscount.id,
      name: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsCartDiscount.name) || undefined,
      description:
        LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsCartDiscount.description) || undefined,
      discountValue: commercetoolsCartDiscount.value
        ? this.commercetoolsCartDiscountValueToCartDiscountValue(commercetoolsCartDiscount.value, locale)
        : undefined,
      cartPredicate: commercetoolsCartDiscount.cartPredicate,
      target: commercetoolsCartDiscount.target
        ? this.commercetoolsCartDiscountTargetToCartDiscountTarget(commercetoolsCartDiscount.target)
        : undefined,
    };
  }

  static commercetoolsCartDiscountTargetToCartDiscountTarget(
    commercetoolsCartDiscountTarget: CommercetoolsCartDiscountTarget,
  ): CartDiscountTarget | undefined {
    switch (commercetoolsCartDiscountTarget.type) {
      case 'lineItems':
        return {
          type: 'lineItems',
          predicate: commercetoolsCartDiscountTarget.predicate,
        };
      case 'pattern':
        return {
          type: 'pattern',
          maxOccurrence: commercetoolsCartDiscountTarget.maxOccurrence,
          selectionMode: this.commercetoolsSelectionModeToCartDiscountSelectionMode(
            commercetoolsCartDiscountTarget.selectionMode,
          ),
        };
      case 'shipping':
        return {
          type: 'shipping',
        };
      case 'totalPrice':
        return {
          type: 'totalPrice',
        };
      default:
        return undefined;
    }
  }

  static commercetoolsSelectionModeToCartDiscountSelectionMode(
    commercetoolsSelectionMode: CommercetoolsSelectionMode,
  ): CartDiscountSelectionMode | undefined {
    switch (commercetoolsSelectionMode) {
      case 'Cheapest':
        return 'Cheapest';
      case 'MostExpensive':
        return 'MostExpensive';
      default:
        return undefined;
    }
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

  static commercetoolsDiscountedPricesPerQuantityToDiscountedPricePerCount(
    commercetoolsDiscountedLineItemPricesForQuantity: CommercetoolsDiscountedLineItemPriceForQuantity[] | undefined,
    locale: Locale,
    defaultLocale: string,
  ): DiscountedPricePerCount[] {
    return commercetoolsDiscountedLineItemPricesForQuantity?.map(
      (commercetoolsDiscountedLineItemPriceForQuantity): DiscountedPricePerCount => {
        return {
          count: commercetoolsDiscountedLineItemPriceForQuantity.quantity,
          discountedPrice: this.commercetoolsDiscountedLineItemPriceToDiscountedPrice(
            commercetoolsDiscountedLineItemPriceForQuantity.discountedPrice,
            locale,
            defaultLocale,
          ),
        };
      },
    );
  }

  static commercetoolsDiscountedLineItemPriceToDiscountedPrice(
    commercetoolsDiscountedLineItemPrice: CommercetoolsDiscountedLineItemPrice | undefined,
    locale: Locale,
    defaultLocale: string,
  ): DiscountedPrice | undefined {
    if (commercetoolsDiscountedLineItemPrice === undefined) {
      return undefined;
    }

    return {
      value: ProductMapper.commercetoolsMoneyToMoney(commercetoolsDiscountedLineItemPrice.value),
      includedDiscounts: commercetoolsDiscountedLineItemPrice.includedDiscounts.map(
        (commercetoolsDiscountedLineItemPortion) =>
          CartMapper.commercetoolsDiscountPortionToDiscountedPortion(
            commercetoolsDiscountedLineItemPortion,
            locale,
            defaultLocale,
          ),
      ),
    };
  }

  static commercetoolsTaxedPriceToTaxed(commercetoolsTaxedPrice: CommercetoolsTaxedPrice | undefined): Tax | undefined {
    if (commercetoolsTaxedPrice === undefined) {
      return undefined;
    }

    return {
      netAmount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxedPrice.totalNet),
      grossAmount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxedPrice.totalGross),
      taxAmount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxedPrice.totalTax),
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

  static commercetoolsTaxedItemPriceToTaxed(
    commercetoolsTaxedPrice: CommercetoolsTaxedItemPrice | undefined,
  ): Tax | undefined {
    if (commercetoolsTaxedPrice === undefined) {
      return undefined;
    }

    return {
      netAmount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxedPrice.totalNet),
      grossAmount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxedPrice.totalGross),
      taxAmount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxedPrice.totalTax),
    };
  }

  static commercetoolsTaxRateToTaxRate(commercetoolsTaxRate: CommercetoolsTaxRate | undefined): TaxRate | undefined {
    if (commercetoolsTaxRate === undefined) {
      return undefined;
    }

    return {
      taxRateId: commercetoolsTaxRate?.id,
      taxRateKey: commercetoolsTaxRate?.key,
      name: commercetoolsTaxRate?.name,
      amount: commercetoolsTaxRate?.amount,
      includedInPrice: commercetoolsTaxRate?.includedInPrice,
      country: commercetoolsTaxRate?.country,
      state: commercetoolsTaxRate?.state,
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

  static commercetoolsCartStateToCartState(commercetoolsCartState: CommercetoolsCartState): CartState {
    let cartState: CartState;

    switch (true) {
      case commercetoolsCartState === 'Frozen':
        cartState = CartState.Frozen;
        break;
      case commercetoolsCartState === 'Merged':
        cartState = CartState.Merged;
        break;
      case commercetoolsCartState === 'Ordered':
        cartState = CartState.Ordered;
        break;
      case commercetoolsCartState === 'Active':
      default:
        cartState = CartState.Active;
        break;
    }

    return cartState;
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

  static getPurchaseOrderNumber(commercetoolsOrder: CommercetoolsOrder): string | undefined {
    if (commercetoolsOrder?.purchaseOrderNumber) {
      return commercetoolsOrder.purchaseOrderNumber;
    }

    // CoCo checkout uses custom fields to store the purchase order number
    const purchaseOrderNumber = commercetoolsOrder?.paymentInfo?.payments?.find(
      (payment) => payment.obj?.custom?.fields?.launchpadPurchaseOrderNumber !== undefined,
    )?.obj?.custom?.fields?.launchpadPurchaseOrderNumber;

    return purchaseOrderNumber;
  }

  static isCartDiscountReferenceExpanded(reference: Reference): reference is CartDiscountReference {
    return reference.typeId === 'cart-discount' && reference.obj !== undefined;
  }

  static commercetoolsCartDiscountValueToCartDiscountValue(
    commercetoolsDiscountValue: CommercetoolsCartDiscountValue,
    locale: Locale,
  ): CartDiscountValue {
    switch (commercetoolsDiscountValue.type) {
      case 'absolute':
        return {
          type: 'absolute',
          value: LocalizedValue.getLocalizedCurrencyValue(locale, commercetoolsDiscountValue.money),
        };

      case 'fixed':
        return {
          type: 'fixed',
          value: LocalizedValue.getLocalizedCurrencyValue(locale, commercetoolsDiscountValue.money),
        };

      case 'relative':
        return {
          type: 'relative',
          value: commercetoolsDiscountValue.permyriad || 0,
        };

      case 'giftLineItem':
        return {
          type: 'giftLineItem',
          productId: commercetoolsDiscountValue.product.id,
          variantId: commercetoolsDiscountValue.variantId.toString(),
        };
    }
  }
}
