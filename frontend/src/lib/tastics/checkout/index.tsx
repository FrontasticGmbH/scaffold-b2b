'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Checkout from '@/components/organisms/checkout';
import countries from '@/static/countries.json';
import { resolveReference } from '@/utils/lib/resolve-reference';
import useAccount from '@/lib/hooks/useAccount';
import { mapAddress, mapCoCoAddress } from '@/utils/mappers/map-address';
import useCart from '@/lib/hooks/useCart';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import useStores from '@/lib/hooks/useStores';
import { mapLineItem } from '@/utils/mappers/map-lineitem';
import { mapShippingMethod } from '@/utils/mappers/map-shipping-method';
import { CheckoutPayload } from '@/lib/hooks/useCart/types';
import toast from '@/components/atoms/toaster/helpers/toast';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { Props } from './types';
import { TasticProps } from '../types';
import usePaymentMethods from './hooks/usePaymentMethods';

const CheckoutTastic = ({ data }: TasticProps<Props>) => {
  const router = useRouter();

  const { translate } = useTranslation();

  const { account, addAddress } = useAccount();

  const { defaultBusinessUnit } = useBusinessUnits();

  const { defaultStore } = useStores();

  const { cart, updateCart, setShippingMethod, redeemDiscount, removeDiscount, checkout } = useCart(
    defaultBusinessUnit?.key,
    defaultStore?.key,
  );

  const paymentMethods = usePaymentMethods();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<(typeof paymentMethods)[0]>();
  const [paymentData, setPaymentData] = useState<unknown>({});

  return (
    <Checkout
      initialData={{
        shippingAddress: cart?.shippingAddress && mapAddress(cart?.shippingAddress),
        billingAddress: cart?.billingAddress && mapAddress(cart?.billingAddress),
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
      products={(cart?.lineItems ?? []).map(mapLineItem)}
      addresses={(account?.addresses ?? []).map(mapAddress)}
      shippingMethods={(cart?.availableShippingMethods ?? []).map(mapShippingMethod)}
      countryOptions={countries.map(({ name, code, states }) => ({
        name,
        value: code,
        states: states.map(({ name, code }) => ({ name, value: code })),
      }))}
      termsAndConditionsLink={resolveReference(data.termsAndConditionsLink)}
      onAddAddress={async (address) => {
        const response = await addAddress(mapCoCoAddress(address));
        return !!response.accountId;
      }}
      onApplyDiscount={async (code) => {
        const res = await redeemDiscount(code);
        return !!res.cartId;
      }}
      onCompleteAddresses={async (shippingAddress, billingAddress) => {
        const response = await updateCart({
          shipping: mapCoCoAddress(shippingAddress),
          billing: mapCoCoAddress(billingAddress),
        });

        return !!response.cartId;
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
        const order = await checkout(paymentData as CheckoutPayload);

        if (order.orderId) router.push('/thank-you');
        else toast.error(translate('common.something.went.wrong'), { position: 'top-right' });

        return !!order.orderId;
      }}
    />
  );
};

export default CheckoutTastic;
