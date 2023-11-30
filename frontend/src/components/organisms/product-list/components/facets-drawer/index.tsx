import React from 'react';
import { AdjustmentsHorizontalIcon as FiltersIcon } from '@heroicons/react/24/outline';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useDisclosure from '@/hooks/useDisclosure';
import Drawer from '@/components/organisms/drawer';
import Button from '@/components/atoms/button';
import Facets from '../facets';
import { useProductList } from '../../context';
import ViewToggle from '../view-toggle';

const FacetsDrawer = () => {
  const { translate } = useTranslation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { total } = useProductList();

  return (
    <div>
      <div className="flex gap-3">
        <button
          className="flex grow cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 p-2 leading-[16px] text-gray-600 transition hover:bg-gray-50 md:w-fit md:grow-0"
          onClick={onOpen}
        >
          <span>{translate('product.sortAndFilter')}</span>
          <FiltersIcon width={20} />
        </button>
        <ViewToggle />
      </div>

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        direction="left"
        headline={translate('product.sortAndFilter')}
        className="w-[90vw] max-w-[350px]"
        headerClassName="border-y border-neutral-400"
      >
        <div className="flex h-full flex-col">
          <div className="grow overflow-y-auto px-4 lg:px-5">
            <Facets />
          </div>
          <div className="flex items-center gap-3 border-t border-neutral-400 p-4 lg:p-5">
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              {translate('common.cancel')}
            </Button>
            <Button variant="primary" className="flex-1" onClick={onClose}>
              {translate('common.view')} ({total})
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default FacetsDrawer;
