import React from 'react';
import useDisclosure from '@/hooks/useDisclosure';
import Drawer from '@/components/organisms/drawer';
import { useTranslations } from 'use-intl';
import InfoBanner from '@/components/molecules/info-banner';
import Link from '@/components/atoms/link';
import QuickOrderAccordion from '../quick-order-accordion';
import QuickOrderCSVUpload from './quick-order-csv-upload';
import { QuickOrderDesktopProps } from '../types';
import { QuickOrderDesktopProvider } from './quick-order-csv-upload/context';

const QuickOrderDesktop = ({
  searchText,
  items,
  downloadLink,
  csvProducts,
  csvProductsLoading,
  onSearch,
  addItem,
  addItemDisabled,
  handleSKUsUpdate,
}: QuickOrderDesktopProps) => {
  const translate = useTranslations();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <QuickOrderDesktopProvider
      csvProducts={csvProducts}
      csvProductsLoading={csvProductsLoading}
      downloadLink={downloadLink}
      addItem={addItem}
      handleSKUsUpdate={handleSKUsUpdate}
      onClose={onClose}
    >
      <Link className="whitespace-nowrap p-1 text-gray-700" href="#" onClick={onOpen}>
        {translate('quick-order.quick-order')}
      </Link>
      <Drawer direction="right" isOpen={isOpen} headline="Quick add to cart" onClose={onClose}>
        <div className="h-full overflow-y-scroll">
          <div className="px-4 lg:px-5">
            {addItemDisabled && (
              <InfoBanner className="mt-3">
                <b>{translate('common.view-only')}</b> {translate('cart.view-only-desc')}
              </InfoBanner>
            )}
          </div>

          <div className="mt-10 px-4 lg:px-5">
            <QuickOrderAccordion
              searchText={searchText}
              items={items}
              onSearch={onSearch}
              addItem={addItem}
              addItemDisabled={addItemDisabled}
              closeMenu={onClose}
            />
          </div>
          <div className="mt-5 hidden px-4 lg:block lg:px-5">
            <QuickOrderCSVUpload addItemDisabled={addItemDisabled} />
          </div>
        </div>
      </Drawer>
    </QuickOrderDesktopProvider>
  );
};
export default QuickOrderDesktop;
