import React from 'react';
import Typography from '@/components/atoms/typography';
import useDisclosure from '@/hooks/useDisclosure';
import Drawer from '@/components/organisms/drawer';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import InfoBanner from '@/components/molecules/info-banner';
import QuickOrderAccordion from '../quick-order-accordion';
import QuickOrderCSVUpload from './quick-order-csv-upload';
import { QuickOrderDesktopProps } from '../types';
import { QuickOrderDesktopProvider } from './quick-order-csv-upload/context';

const QuickOrderDesktop = ({
  searchText,
  items,
  downloadLink,
  csvProducts,
  onSearch,
  addItem,
  addItemDisabled,
  handleSKUsUpdate,
}: QuickOrderDesktopProps) => {
  const { translate } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <QuickOrderDesktopProvider
      csvProducts={csvProducts}
      downloadLink={downloadLink}
      addItem={addItem}
      handleSKUsUpdate={handleSKUsUpdate}
      onClose={onClose}
    >
      <div className="cursor-pointer underline-offset-4 hover:underline">
        <div onClick={onOpen}>
          <Typography fontSize={16} className="whitespace-nowrap text-gray-700">
            {translate('quick-order.quick.order')}
          </Typography>
        </div>
      </div>
      <Drawer direction="right" isOpen={isOpen} headline="Quick add to cart" onClose={onClose}>
        <div className="h-full overflow-y-scroll">
          <div className="px-4 lg:px-5">
            {addItemDisabled && (
              <InfoBanner className="mt-3">
                <b>{translate('common.view.only')}</b> {translate('cart.view.only.desc')}
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
