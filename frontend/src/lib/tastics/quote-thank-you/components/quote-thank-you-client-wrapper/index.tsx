'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import useQuotes from '@/lib/hooks/useQuotes';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import QuoteThankYou from '@/components/organisms/quote-thank-you';
import useCustomRouter from '@/hooks/useCustomRouter';
import useAccount from '@/lib/hooks/useAccount';
import { Address } from '@shared/types/account';
import { mapAddress } from '@/utils/mappers/map-address';
import { calculateTransaction } from '@/lib/utils/calculate-transaction';
import { mapLineItem } from '@/utils/mappers/map-lineitem';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import useTranslation from '@/providers/I18n/hooks/useTranslation';

const QuoteThankYouClientWrapper = () => {
  const { translate } = useTranslation();

  const router = useCustomRouter();

  const { account } = useAccount();

  const searchParams = useSearchParams();

  const quoteRequestId = searchParams.get('quoteRequestId');

  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

  const { quoteRequests } = useQuotes({
    ids: [quoteRequestId as string],
    businessUnitKey: selectedBusinessUnit?.key,
    storeKey: selectedStore?.key,
  });

  const quoteRequest = quoteRequests.items?.[0];

  if (!quoteRequest) return <></>;

  const transaction = calculateTransaction(quoteRequest);

  return (
    <QuoteThankYou
      account={{ email: account?.email ?? '' }}
      quoteRequestId={quoteRequestId ?? ''}
      deliveryAddress={mapAddress(quoteRequest.shippingAddress as Address)}
      billingAddress={mapAddress(quoteRequest.billingAddress as Address)}
      comment={quoteRequest.buyerComment}
      paymentMethod={translate('thank-you.payment.purchase.order', {
        values: { number: quoteRequest.purchaseOrderNumber ?? '' },
      })}
      transaction={{
        subtotal: transaction.subtotal.centAmount,
        shipping: transaction.shipping.centAmount,
        discounts: transaction.discount.centAmount,
        taxes: transaction.tax.centAmount,
        total: transaction.total.centAmount,
        currency: transaction.total.currencyCode,
      }}
      lineItems={(quoteRequest.lineItems ?? []).map(mapLineItem)}
      onReviewQuoteClick={() => router.push(DashboardLinks.quoteRequestDetail(quoteRequestId ?? ''))}
    />
  );
};

export default QuoteThankYouClientWrapper;
