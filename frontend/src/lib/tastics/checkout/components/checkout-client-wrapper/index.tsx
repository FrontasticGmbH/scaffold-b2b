'use client';

import React, { useState } from 'react';
import useCustomRouter from '@/hooks/useCustomRouter';
import Checkout from '@/components/organisms/checkout';
import countries from '@/static/countries.json';
import { resolveReference } from '@/utils/lib/resolve-reference';
import { mapAddress, mapCoCoAddress } from '@/utils/mappers/map-address';
import useCart from '@/lib/hooks/useCart';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import { mapLineItem } from '@/utils/mappers/map-lineitem';
import { mapShippingMethod } from '@/utils/mappers/map-shipping-method';
import toast from '@/components/atoms/toaster/helpers/toast';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import useAccount from '@/lib/hooks/useAccount';
import { TasticProps } from '@/lib/tastics/types';
import { isEmptyObject } from '@/utils/object/is-empty-object';
import { Address } from '@/types/entity/address';
import useApprovalFlows from '@/lib/hooks/useApprovalFlows';
import { Props } from '../../types';
import usePaymentMethods from '../../hooks/usePaymentMethods';

const CheckoutClientWrapper = ({ data }: TasticProps<Props>) => {
  const router = useCustomRouter();

  const { account } = useAccount();

  const { translate } = useTranslation();

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
      paymentMethods={paymentMethods}
      discounts={(cart?.discountCodes ?? []).map(({ discountId, name, code }) => ({
        name: name ?? '',
        code: code ?? '',
        onRemove: async () => {
          const res = await removeDiscount(discountId ?? '');
          return !!res.cartId;
        },
      }))}
      transaction={{
        subtotal: cart?.transaction.subtotal.centAmount ?? 0,
        discounts: cart?.transaction.discount.centAmount ?? 0,
        shipping: {
          isEstimated: !cart?.shippingInfo,
          amount: cart?.transaction.shipping.centAmount ?? 0,
        },
        taxes: cart?.transaction.tax.centAmount ?? 0,
        total: cart?.transaction.total.centAmount ?? 0,
        currency: cart?.transaction.total.currencyCode ?? 'USD',
      }}
      translations={{
        review: translate('checkout.review.order'),
      }}
      products={(cart?.lineItems ?? []).map(mapLineItem)}
      addresses={selectedBusinessUnit?.addresses ?? []}
      shippingMethods={(cart?.availableShippingMethods ?? []).map(mapShippingMethod)}
      countryOptions={countries.map(({ name, code, states }) => ({
        name,
        value: code,
        states: states.map(({ name, code }) => ({ name, value: code })),
      }))}
      termsAndConditionsLink={resolveReference(data.termsAndConditionsLink)}
      onAddAddress={async (address) => {
        if (!selectedBusinessUnit?.key) return false;

        const response = await addAddress({ ...mapCoCoAddress(address), businessUnitKey: selectedBusinessUnit?.key });
        return !!response.businessUnitId;
      }}
      onApplyDiscount={async (code) => {
        const res = await redeemDiscount(code);
        return !!res.cartId;
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
          router.push(`/thank-you?orderId=${orderId}`);
        } else toast.error(translate('common.something.went.wrong'), { position: 'top-right' });

        return !!orderId;
      }}
    />
  );
};

export default CheckoutClientWrapper;
