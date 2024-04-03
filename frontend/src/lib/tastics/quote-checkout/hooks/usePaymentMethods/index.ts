import useCart from '@/lib/hooks/useCart';
import { QuoteRequestPayload } from '@/lib/hooks/useCart/types';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';

const usePaymentMethods = () => {
  const { translate } = useTranslation();

  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

  const { requestQuote } = useCart(selectedBusinessUnit?.key, selectedStore?.key);

  const paymentMethods = [
    {
      id: 'purchase.order',
      name: `${translate('checkout.purchase.order')} (PO)`,
      description: translate('checkout.purchase.order.desc'),
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
