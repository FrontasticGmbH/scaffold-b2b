import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import { classnames } from '@/utils/classnames/classnames';
import { CurrencyHelpers } from '@/utils/currency-helpers';
import Typography from '@/components/atoms/typography';
import { AccordionButtonProps } from '../types';

const AccordionButton = ({ open, toggleAccordion, total }: AccordionButtonProps) => {
  const translate = useTranslations();

  const accordionContentClassNames = classnames('flex w-full justify-between border-t py-16', open ? 'border-t' : '');

  const arrowClassNames = classnames(open ? 'rotate-180' : '', 'mr-8 transition');

  return (
    <div className="w-full">
      <div className={accordionContentClassNames} onClick={toggleAccordion}>
        <Typography fontSize={16}>{translate('orders.your-order')}</Typography>

        <div className="flex">
          <Typography fontSize={16} className="hidden pr-8 md:block">
            {CurrencyHelpers.formatForCurrency(total)}
          </Typography>
          <ChevronDownIcon width={20} strokeWidth={1.5} className={arrowClassNames} />
        </div>
      </div>
    </div>
  );
};

export default AccordionButton;
