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
import { formatCentAmount } from '@/lib/utils/format-price';
import { mapLineItem } from '@/utils/mappers/map-lineitem';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import { useTranslations } from 'use-intl';

const QuoteThankYouClientWrapper = () => {
  const translate = useTranslations();

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
    <div data-testid={`quote_request-${quoteRequestId}`}>
      <QuoteThankYou
        account={{ email: account?.email ?? '' }}
        quoteRequestId={quoteRequestId ?? ''}
        deliveryAddress={mapAddress(quoteRequest.shippingAddress as Address)}
        billingAddress={mapAddress(quoteRequest.billingAddress as Address)}
        comment={quoteRequest.buyerComment}
        paymentMethod={translate('thank-you.payment-purchase-order', {
          number: quoteRequest.purchaseOrderNumber ?? '',
        })}
        transaction={{
          subtotal: formatCentAmount(transaction.subtotal.centAmount, transaction.subtotal.fractionDigits),
          shipping: formatCentAmount(transaction.shipping.centAmount ?? 0, transaction.shipping.fractionDigits),
          discounts: formatCentAmount(transaction.discount.centAmount, transaction.discount.fractionDigits),
          taxes: formatCentAmount(transaction.tax.centAmount ?? 0, transaction.tax.fractionDigits),
          total: formatCentAmount(transaction.total.centAmount, transaction.total.fractionDigits),
          currency: transaction.total.currencyCode,
        }}
        lineItems={(quoteRequest.lineItems ?? []).map((item) =>
          mapLineItem(item, { discountCodes: quoteRequest.quotationCart?.discountCodes ?? [] }),
        )}
        onReviewQuoteClick={() => router.push(DashboardLinks.quoteRequestDetail(quoteRequestId ?? ''))}
        purchaseOrderNumber={quoteRequest.purchaseOrderNumber}
      />
    </div>
  );
};

export default QuoteThankYouClientWrapper;
