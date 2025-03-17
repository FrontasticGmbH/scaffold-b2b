import useCart from '@/lib/hooks/useCart';
import { QuoteRequestPayload } from '@/lib/hooks/useCart/types';
import { useTranslations } from 'use-intl';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';

const usePaymentMethods = () => {
  const translate = useTranslations();

  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

  const { requestQuote } = useCart(selectedBusinessUnit?.key, selectedStore?.key);

  const paymentMethods = [
    {
      id: 'purchase.order',
      name: `${translate('checkout.purchase-order')} (PO)`,
      description: translate('checkout.purchase-order-desc'),
      image: {
        src: '',
        className: '',
      },
      async makePayment(data: unknown) {
        const quoteRequest = await requestQuote(data as QuoteRequestPayload);

        return quoteRequest.quoteRequestId;
      },
    },
  ];

  return paymentMethods;
};

export default usePaymentMethods;
