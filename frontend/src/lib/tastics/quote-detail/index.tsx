'use client';

import React from 'react';
import { DataSource } from '@/types/lib/datasources';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import QuoteDetailsPage from '@/components/pages/dashboard/pages/quote-details';
import { mapQuote } from '@/utils/mappers/map-quote';
import useAccount from '@/lib/hooks/useAccount';
import useQuotes from '@/lib/hooks/useQuotes';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import useCustomRouter from '@/hooks/useCustomRouter';
import toast from 'react-hot-toast';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Link from '@/components/atoms/link';
import { InformationCircleIcon as InfoIcon } from '@heroicons/react/24/solid';
import { DataSourceProps } from './types';
import { TasticProps } from '../types';

const QuoteDetailTastic = ({ data }: TasticProps<DataSource<DataSourceProps>>) => {
  const router = useCustomRouter();

  const { translate } = useTranslation();

  const { account } = useAccount();

  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

  const { declineQuote, renegotiateQuote, acceptQuote, getQuotationCart } = useQuotes({
    businessUnitKey: selectedBusinessUnit?.key ?? '',
    storeKey: selectedStore?.key ?? '',
  });

  const quote = data.data?.dataSource?.quote;

  if (!quote) return <></>;

  return (
    <Dashboard href={DashboardLinks.quotes} userName={account?.firstName}>
      <QuoteDetailsPage
        quote={mapQuote(quote)}
        onReject={async () => {
          await declineQuote(quote.quoteId as string);
          router.refresh();
        }}
        onRenegotiate={async (comment: string) => {
          await renegotiateQuote({ id: quote.quoteId as string, comment });
          router.refresh();
        }}
        onAccept={async () => {
          await acceptQuote(quote.quoteId as string);
          router.refresh();
        }}
        onCheckout={async () => {
          const res = await getQuotationCart(quote.quoteId as string);

          if (res.isSuccess) {
            router.refresh();
            router.push('/cart');
          } else if (res.message?.message === 'Error: Cart has already been ordered.') {
            toast.custom(
              <div className="flex max-w-[500px] items-center justify-between gap-3 rounded-lg bg-[#EAF2FC] p-3">
                <InfoIcon className="text-[#416BD8]" width={32} height={32} />
                <p className="text-14 text-gray-700">
                  {translate('dashboard.quote.finalized')}. {translate('dashboard.go.to.the')}{' '}
                  <Link href={DashboardLinks.orders} className="font-medium underline">
                    {translate('dashboard.orders.page')}
                  </Link>{' '}
                  {translate('dashboard.to.review.existing.orders')}
                </p>
              </div>,
              {
                position: 'top-right',
              },
            );
          } else {
            toast.error(translate('common.something.went.wrong'), { position: 'top-right' });
          }
        }}
        onViewOrder={async () => {
          if (quote.orderNumber) router.push(DashboardLinks.orderDetail(quote.orderNumber.replace(/\s/g, '-')));
        }}
      />
    </Dashboard>
  );
};

export default QuoteDetailTastic;
