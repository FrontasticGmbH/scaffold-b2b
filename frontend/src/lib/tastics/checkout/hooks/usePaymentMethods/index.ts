import useTranslation from '@/providers/I18n/hooks/useTranslation';

const usePaymentMethods = () => {
  const { translate } = useTranslation();

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
        console.log(data);
        return true;
      },
    },
  ];

  return paymentMethods;
};

export default usePaymentMethods;
