import React from 'react';
import Accordion from '@/components/molecules/accordion';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import QuickOrderContent from './quick-order-content';
import { QuickOrderContentProps } from '../types';

const QuickOrderAccordion = ({
  items,
  searchText,
  onSearch,
  addItem,
  addItemDisabled,
  closeMenu,
}: QuickOrderContentProps) => {
  const { translate } = useTranslation();
  return (
    <Accordion defaultIsExpanded>
      <Accordion.Button defaultSpacing={false} className="p-3 text-gray-700">
        {translate('quick-order.search')}
      </Accordion.Button>
      <Accordion.Panel defaultSpacing={false} className="p-3">
        <QuickOrderContent
          searchText={searchText}
          items={items}
          onSearch={onSearch}
          addItem={addItem}
          closeMenu={closeMenu}
          addItemDisabled={addItemDisabled}
        />
      </Accordion.Panel>
    </Accordion>
  );
};

export default QuickOrderAccordion;
