'use client';

import toast from '@/components/atoms/toaster/helpers/toast';
import Checkout from '@/components/organisms/checkout';
import useCustomRouter from '@/hooks/useCustomRouter';
import useAccount from '@/lib/hooks/useAccount';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import useApprovalFlows from '@/lib/hooks/useApprovalFlows';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import useCart from '@/lib/hooks/useCart';
import useProjectSettings from '@/lib/hooks/useProjectSettings';
import { TasticProps } from '@/lib/tastics/types';
import { formatCentAmount, formatDiscountSegments } from '@/lib/utils/format-price';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { Address } from '@/types/entity/address';
import { resolveReference } from '@/utils/lib/resolve-reference';
import { mapAddress, mapCoCoAddress } from '@/utils/mappers/map-address';
import { mapCountry } from '@/utils/mappers/map-country';
import { mapDiscountCode } from '@/utils/mappers/map-discount-code';
import { mapLineItem } from '@/utils/mappers/map-lineitem';
import { mapShippingMethod } from '@/utils/mappers/map-shipping-method';
import { isEmptyObject } from '@/utils/object/is-empty-object';
import { useEffect, useState } from 'react';
import { useTranslations } from 'use-intl';
import usePaymentMethods from '../../hooks/usePaymentMethods';
import { Props } from '../../types';

const CheckoutClientWrapper = ({ data }: TasticProps<Props>) => {
  const router = useCustomRouter();

  const { projectSettings } = useProjectSettings();

  const { account } = useAccount();
  const { permissions } = useAccountRoles();

  const translate = useTranslations();

  const { addAddress } = useBusinessUnits();

  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

  const { mutateAll: mutateAllApprovalFlows } = useApprovalFlows({ businessUnitKey: selectedBusinessUnit?.key });

  const { cart, updateCart, setShippingMethod, redeemDiscount, removeDiscount } = useCart(
    selectedBusinessUnit?.key,
    selectedStore?.key,
  );

  const paymentMethods = usePaymentMethods();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<(typeof paymentMethods)[0]>();
  const [paymentData, setPaymentData] = useState<unknown>({});
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<string | undefined>();

  const canAddAddress = permissions.UpdateBusinessUnitDetails;

  // Sync selectedShippingMethodId with cart's shippingInfo if it exists
  useEffect(() => {
    if (cart?.shippingInfo?.shippingMethodId) {
      setSelectedShippingMethodId(cart.shippingInfo.shippingMethodId);
    }
  }, [cart?.shippingInfo?.shippingMethodId]);

  // Calculate shipping cost from selected method when shippingInfo is not available
  const calculateShippingFromMethod = () => {
    if (cart?.shippingInfo?.price?.centAmount !== undefined) {
      // If we have actual shipping info from the cart, use it
      return cart.transaction.shipping.centAmount;
    }

    if (selectedShippingMethodId && cart?.availableShippingMethods) {
      // Find the selected shipping method
      const selectedMethod = cart.availableShippingMethods.find(
        (method) => method.shippingMethodId === selectedShippingMethodId,
      );

      if (selectedMethod?.rates?.[0]?.price?.centAmount !== undefined) {
        const shippingRate = selectedMethod.rates[0];
        const shippingPrice = shippingRate.price?.centAmount;
        const freeAbove = shippingRate.freeAbove?.centAmount;

        // Calculate cart subtotal (before shipping and taxes) to check free shipping threshold
        // Use raw centAmount values from cart transaction
        const cartSubtotal =
          (cart?.transaction.subtotal.centAmount ?? 0) - (cart?.transaction.discount.centAmount ?? 0);

        // Check if cart meets free shipping threshold
        if (freeAbove && cartSubtotal >= freeAbove) {
          return 0;
        }

        return shippingPrice ?? 0;
      }
    }

    // Fall back to estimated shipping
    return cart?.transaction.shipping.centAmount;
  };

  const shippingAmount = calculateShippingFromMethod();

  // Calculate total with the selected shipping method
  const calculateTotal = () => {
    if (!cart?.transaction) return 0;

    const baseTotal = cart.transaction.total.centAmount;

    // If shipping was estimated but we now have a selected method, adjust the total
    if (cart.transaction.shipping.isEstimated && selectedShippingMethodId && shippingAmount !== undefined) {
      // Remove the estimated shipping and add the actual shipping
      const estimatedShipping = cart.transaction.shipping.centAmount || 0;
      return baseTotal - estimatedShipping + shippingAmount;
    }

    return baseTotal;
  };

  // Extract shipping discount info if it exists
  // First check if a shipping method is already selected (shippingInfo exists)
  const shippingDiscountFromInfo = cart?.shippingInfo?.discountedPrice
    ? {
        originalPrice: cart.shippingInfo.price?.centAmount ?? 0,
        discountedPrice: cart.shippingInfo.discountedPrice.value.centAmount ?? 0,
        discountPercentage:
          cart.shippingInfo.discountedPrice.includedDiscounts?.[0]?.discount?.discountValue?.type === 'relative'
            ? cart.shippingInfo.discountedPrice.includedDiscounts[0].discount.discountValue.value
            : undefined,
      }
    : undefined;

  // If no shipping method selected yet, check if there's a shipping discount code applied
  // This allows showing discount preview on all shipping methods before selection
  const shippingDiscountFromCode =
    !shippingDiscountFromInfo && cart?.discountCodes
      ? cart.discountCodes
          .find((code) =>
            code.discounts?.some(
              (discount) =>
                discount.discountValue?.type === 'relative' &&
                // Check if this discount targets shipping (via target property or pattern matching)
                (discount as any).target?.type === 'shipping',
            ),
          )
          ?.discounts?.find((discount) => (discount as any).target?.type === 'shipping')
      : undefined;

  const shippingDiscount =
    shippingDiscountFromInfo ||
    (shippingDiscountFromCode
      ? {
          originalPrice: 0, // Will be calculated per shipping method
          discountedPrice: 0, // Will be calculated per shipping method
          discountPercentage:
            shippingDiscountFromCode.discountValue?.type === 'relative'
              ? shippingDiscountFromCode.discountValue.value
              : undefined,
        }
      : undefined);

  return (
    <Checkout
      enableCtCheckout={data.enableCtCheckout}
      initialData={{
        shippingAddress:
          cart?.shippingAddress && !isEmptyObject(cart.shippingAddress)
            ? mapAddress(cart?.shippingAddress as Address)
            : undefined,
        billingAddress:
          cart?.billingAddress && !isEmptyObject(cart.billingAddress)
            ? mapAddress(cart?.billingAddress as Address)
            : undefined,
        shippingMethodId: cart?.shippingInfo?.shippingMethodId,
      }}
      paymentMethods={paymentMethods}
      discounts={(cart?.discountCodes ?? []).map((code) => ({
        ...mapDiscountCode(code),
        onRemove: async () => {
          const res = await removeDiscount(code.discountCodeId ?? '');
          return !!res.cartId;
        },
      }))}
      shippingDiscount={shippingDiscount}
      transaction={{
        subtotal: formatCentAmount(
          cart?.transaction.subtotal.centAmount ?? 0,
          cart?.transaction.subtotal.fractionDigits ?? 2,
        ),
        discounts: formatCentAmount(
          cart?.transaction.discount.centAmount ?? 0,
          cart?.transaction.discount.fractionDigits ?? 2,
        ),
        discountSegments: formatDiscountSegments(
          cart?.transaction.discount.segments ?? [],
          cart?.transaction.discount.fractionDigits ?? 2,
        ),
        shipping: {
          isEstimated: !selectedShippingMethodId && !cart?.shippingInfo,
          shippingIncludesTaxes: cart?.transaction.shipping.includesTaxes,
          amount:
            shippingAmount !== undefined
              ? formatCentAmount(shippingAmount, cart?.transaction.shipping.fractionDigits ?? 2)
              : undefined,
          freeAbove: cart?.transaction.shipping.freeAbove,
        },
        taxes: cart?.transaction.tax.centAmount
          ? formatCentAmount(cart.transaction.tax.centAmount, cart.transaction.tax.fractionDigits ?? 2)
          : undefined,
        total: formatCentAmount(calculateTotal(), cart?.transaction.total.fractionDigits ?? 2),
        currency: cart?.transaction.total.currencyCode ?? 'USD',
      }}
      translations={{
        review: translate('checkout.review-order'),
      }}
      products={(cart?.lineItems ?? []).map((item) => mapLineItem(item, { discountCodes: cart?.discountCodes ?? [] }))}
      addresses={selectedBusinessUnit?.addresses ?? []}
      shippingMethods={(cart?.availableShippingMethods ?? []).map(mapShippingMethod)}
      countryOptions={(projectSettings?.countries ?? []).map(mapCountry).map(({ name, code, states }) => ({
        name,
        value: code,
        states: states.map(({ name, code }) => ({ name, value: code })),
      }))}
      termsAndConditionsLink={resolveReference(data.termsAndConditionsLink)}
      includeTotalAmountInSummary={false}
      onAddAddress={
        canAddAddress
          ? async (address) => {
              if (!selectedBusinessUnit?.key) return false;

              const response = await addAddress({
                ...mapCoCoAddress(address),
                businessUnitKey: selectedBusinessUnit?.key,
              });
              return !!response.businessUnitId;
            }
          : undefined
      }
      onApplyDiscount={async (code) => {
        const res = await redeemDiscount(code);
        return res;
      }}
      onCompleteAddresses={async (shippingAddress, billingAddress) => {
        if (!account) return false;

        const response = await updateCart({
          email: account.email,
          shipping: mapCoCoAddress(shippingAddress),
          billing: mapCoCoAddress(billingAddress),
        });

        return response.success;
      }}
      onCompleteShipping={async (shippingMethodId) => {
        const response = await setShippingMethod(shippingMethodId);

        if (response.cartId) {
          setSelectedShippingMethodId(shippingMethodId);
        }

        return !!response.cartId;
      }}
      onCompletePayment={async (paymentMethodId, data) => {
        const paymentMethod = paymentMethods.find((method) => method.id === paymentMethodId);

        if (!paymentMethod) return false;

        setSelectedPaymentMethod(paymentMethod);
        setPaymentData(data);

        return true;
      }}
      onSubmitPurchase={async () => {
        if (!selectedPaymentMethod) return false;

        const orderId = await selectedPaymentMethod.makePayment(paymentData);

        if (orderId) {
          mutateAllApprovalFlows();
          router.push(`${data.callbackUrl}?orderId=${orderId}`);
        } else toast.error(translate('common.something-went-wrong'), { position: 'top-right' });

        return !!orderId;
      }}
      codeApplied={data.codeApplied}
      callbackUrl={data.callbackUrl}
    />
  );
};

export default CheckoutClientWrapper;
