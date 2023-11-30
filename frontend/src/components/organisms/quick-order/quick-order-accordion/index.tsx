import React from 'react';
import Accordion from '@/components/molecules/accordion';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import QuickOrderContent from '../quick-order-content';
import { QuickOrderAccordionProps } from '../types';

const QuickOrderAccordion = ({ items }: QuickOrderAccordionProps) => {
  const { translate } = useTranslation();
  return (
    <Accordion defaultIsExpanded>
      <Accordion.Button defaultSpacing={false} className="p-3 text-gray-700">
        {translate('quick-order.search')}
      </Accordion.Button>
      <Accordion.Panel defaultSpacing={false} className="p-3">
        <QuickOrderContent items={items} />
      </Accordion.Panel>
    </Accordion>
  );
};

export default QuickOrderAccordion;
