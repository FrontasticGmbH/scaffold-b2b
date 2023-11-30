import { useMemo } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { classnames } from '@/utils/classnames/classnames';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Typography from '@/components/atoms/typography';
import Image from '@/components/atoms/Image';
import { ClosedButtonProps } from '../types';

const ClosedButton = ({ lineItems, hiddenItemsCount, open, onClick }: ClosedButtonProps) => {
  const { translate } = useTranslation();

  const arrowClassNames = classnames(open ? 'rotate-180' : '', 'mr-8 transition');

  const lineItemOrderSummary = useMemo(() => lineItems.slice(0, 3), [lineItems]);

  return (
    <div className="flex w-full flex-col overflow-x-visible pb-4" onClick={onClick}>
      <div className="flex w-full justify-between">
        <Typography fontSize={16} className="text-secondary">
          {translate('orders.your.order')}
        </Typography>
        <ChevronDownIcon width={20} strokeWidth={1.5} className={arrowClassNames} />
      </div>
      <div className="mt-12 flex justify-between pr-20">
        {!open && (
          <div className="flex w-[70%] items-center">
            {lineItemOrderSummary?.map((lineItem) => (
              <div key={lineItem?.lineItemId} className="pr-16">
                {lineItem?.variant?.images?.[0] && (
                  <div key={lineItem?.lineItemId} className="relative mr-12 h-[104px] w-[88px] shrink-0">
                    <Image
                      fill
                      src={lineItem.variant.images[0]}
                      style={{ objectFit: 'contain' }}
                      alt={lineItem.name ?? 'item image'}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {hiddenItemsCount > 0 && !open && (
          <div className="flex items-center">
            <Typography fontSize={16} className="mr-8 whitespace-nowrap text-secondary">
              {`+ ${hiddenItemsCount}`}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClosedButton;
