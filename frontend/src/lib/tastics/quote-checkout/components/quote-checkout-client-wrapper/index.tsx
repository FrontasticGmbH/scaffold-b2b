'use client';

import toast from '@/components/atoms/toaster/helpers/toast';
import Checkout from '@/components/organisms/checkout';
import { SubmitPurchasePayload } from '@/components/organisms/checkout/types';
import useCustomRouter from '@/hooks/useCustomRouter';
import useAccount from '@/lib/hooks/useAccount';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import useCart from '@/lib/hooks/useCart';
import useProjectSettings from '@/lib/hooks/useProjectSettings';
import { TasticProps } from '@/lib/tastics/types';
import { formatCentAmount, formatDiscountSegments } from '@/lib/utils/format-price';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { resolveReference } from '@/utils/lib/resolve-reference';
import { mapAddress, mapCoCoAddress } from '@/utils/mappers/map-address';
import { mapCountry } from '@/utils/mappers/map-country';
import { mapLineItem } from '@/utils/mappers/map-lineitem';
import { mapShippingMethod } from '@/utils/mappers/map-shipping-method';
import { isEmptyObject } from '@/utils/object/is-empty-object';
import { Address } from '@shared/types/account';
import { useEffect, useState } from 'react';
import { useTranslations } from 'use-intl';
import usePaymentMethods from '../../hooks/usePaymentMethods';
import { Props } from '../../types';

const QuoteCheckoutClientWrapper = ({ data }: TasticProps<Props>) => {
  const router = useCustomRouter();

  const { projectSettings } = useProjectSettings();

  const { account } = useAccount();
  const { permissions } = useAccountRoles();

  const translate = useTranslations();

  const { addAddress } = useBusinessUnits();

  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

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
    if (cart?.shippingInfo?.price?.centAmount) {
      // If we have actual shipping info, use it
      return cart.transaction.shipping.centAmount;
    }

    if (selectedShippingMethodId && cart?.availableShippingMethods) {
      // Find the selected shipping method
      const selectedMethod = cart.availableShippingMethods.find(
        (method) => method.shippingMethodId === selectedShippingMethodId,
      );

      if (selectedMethod?.rates?.[0]?.price?.centAmount) {
        return selectedMethod.rates[0].price.centAmount;
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
    if (cart.transaction.shipping.isEstimated && selectedShippingMethodId && shippingAmount) {
      // Remove the estimated shipping and add the actual shipping
      const estimatedShipping = cart.transaction.shipping.centAmount || 0;
      return baseTotal - estimatedShipping + shippingAmount;
    }

    return baseTotal;
  };

  return (
    <Checkout
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
      translations={{
        header: translate('checkout.quote-checkout'),
        orderSummaryTitle: translate('checkout.quote-summary'),
        orderSummarySubtitle: translate('checkout.quote-items'),
        purchase: translate('checkout.submit-quote-request'),
      }}
      buyerCanAddComment
      paymentMethods={paymentMethods}
      discounts={(cart?.discountCodes ?? []).map(({ discountCodeId, name, code }) => ({
        discountCodeId: discountCodeId ?? '',
        name: name ?? '',
        code: code ?? '',
        onRemove: async () => {
          const res = await removeDiscount(discountCodeId ?? '');
          return !!res.cartId;
        },
      }))}
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
          isEstimated: !selectedShippingMethodId && !!cart?.transaction.shipping.isEstimated,
          amount: shippingAmount
            ? formatCentAmount(shippingAmount, cart?.transaction.shipping.fractionDigits ?? 2)
            : undefined,
        },
        taxes: cart?.transaction.tax.centAmount
          ? formatCentAmount(cart.transaction.tax.centAmount, cart.transaction.tax.fractionDigits ?? 2)
          : undefined,
        total: formatCentAmount(calculateTotal(), cart?.transaction.total.fractionDigits ?? 2),
        currency: cart?.transaction.total.currencyCode ?? 'USD',
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

        if (!response.success) {
          toast.error(response.error?.message || translate('common.something-went-wrong'), { position: 'top-right' });
        }

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
      onSubmitPurchase={async ({ buyerComment }: SubmitPurchasePayload) => {
        if (!selectedPaymentMethod) return false;

        const quoteRequestId = await selectedPaymentMethod.makePayment({ ...(paymentData as object), buyerComment });

        if (quoteRequestId) router.push(`/quote-thank-you?quoteRequestId=${quoteRequestId}`);
        else toast.error(translate('common.something-went-wrong'), { position: 'top-right' });

        return !!quoteRequestId;
      }}
      codeApplied={data.codeApplied}
    />
  );
};

export default QuoteCheckoutClientWrapper;
