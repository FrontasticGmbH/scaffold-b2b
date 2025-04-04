import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import { classnames } from '@/utils/classnames/classnames';
import { CurrencyHelpers } from '@/utils/currency-helpers';
import { AccordionButtonProps } from '../types';

const AccordionButton = ({ open, toggleAccordion, total }: AccordionButtonProps) => {
  const translate = useTranslations();

  const accordionContentClassNames = classnames('flex w-full justify-between border-t py-16', open ? 'border-t' : '');

  const arrowClassNames = classnames(open ? 'rotate-180' : '', 'mr-8 transition');

  return (
    <div className="w-full">
      <div className={accordionContentClassNames} onClick={toggleAccordion}>
        <p className="text-16">{translate('orders.your-order')}</p>

        <div className="flex">
          <p className="hidden pr-8 text-16 md:block">{CurrencyHelpers.formatForCurrency(total)}</p>
          <ChevronDownIcon width={20} strokeWidth={1.5} className={arrowClassNames} />
        </div>
      </div>
    </div>
  );
};

export default AccordionButton;
