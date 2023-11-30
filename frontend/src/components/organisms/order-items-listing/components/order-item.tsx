import { useRouter } from 'next/router';
import Image from '@/components/atoms/Image';
import Typography from '@/components/atoms/typography';
import { CurrencyHelpers } from '@/utils/currency-helpers';
import { OrderItemProps } from '../types';

const OrderItem = ({ lineItem }: OrderItemProps) => {
  const { locale } = useRouter();

  return (
    <div key={lineItem.lineItemId} className="flex justify-start border-b py-16">
      {lineItem.variant?.images?.[0] && (
        <div className="relative h-[104px] w-[88px] shrink-0">
          <Image
            fill
            src={lineItem.variant.images[0]}
            style={{ objectFit: 'contain' }}
            alt={lineItem.name ?? 'order item image'}
          />
        </div>
      )}
      <div className="flex flex-col justify-center pl-16">
        <Typography fontSize={14} className="uppercase text-primary">
          {lineItem?.name}
        </Typography>
        <Typography fontSize={14} fontWeight="medium" className="mt-8 text-primary">
          {CurrencyHelpers.formatForCurrency(lineItem?.price as number, locale)}
        </Typography>
        <Typography fontSize={14} className="mt-8 text-primary">
          {`x ${lineItem?.count}`}
        </Typography>
      </div>
    </div>
  );
};

export default OrderItem;
