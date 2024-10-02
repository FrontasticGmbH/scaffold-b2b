import { FC } from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Image from '@/components/atoms/Image';
import { PaymentMethodsProps } from '../types';

const PaymentMethods: FC<PaymentMethodsProps> = ({ paymentMethods }) => {
  const { translate } = useTranslation();

  return (
    <div className="mt-5 md:mt-6 lg:mt-4">
      <div className="hidden lg:block">
        <p className="text-14 leading-[20px] text-secondary">{translate('cart.we.accept')}</p>
      </div>
      <div className="mt-6 flex items-center justify-start gap-4 md:justify-center lg:mt-4 lg:justify-start">
        {paymentMethods.map(({ name, image }) => (
          <div key={name} className="relative size-7">
            <Image {...image} alt={name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
