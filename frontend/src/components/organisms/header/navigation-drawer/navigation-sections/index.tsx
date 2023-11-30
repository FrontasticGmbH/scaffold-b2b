import React, { useContext } from 'react';
import QuickOrderMobile from '@/components/organisms/quick-order/quick-order-mobile';
import ShippingAndLanguageSection from '@/components/organisms/shipping-and-language';
import Typography from '@/components/atoms/typography';
import QuickOrderContent from '@/components/organisms/quick-order/quick-order-content';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import PageLinksSection from './page-links-section';
import CategorySection from './category-section';
import AccountSection from './account-section';
import BackButton from './back-button';
import { HeaderContext } from '../../context';

const NavigationSections = () => {
  const { translate } = useTranslation();
  const { navigationLevel, showQuickOrder, showQuickOrderMenu, quickOrderProducts } = useContext(HeaderContext);

  return (
    <div className="px-4 lg:px-5">
      <div className="border-t" />
      {(showQuickOrder || navigationLevel.length > 0) && <BackButton />}
      {!showQuickOrder && navigationLevel.length === 0 && (
        <div className="py-6">
          <QuickOrderMobile showQuickOrderMenu={showQuickOrderMenu} />
          <PageLinksSection />
        </div>
      )}

      {!showQuickOrder ? (
        <>
          <AccountSection />
          <CategorySection />
          <div className="block lg:hidden">
            {navigationLevel && navigationLevel.length === 0 && <ShippingAndLanguageSection />}
          </div>
        </>
      ) : (
        <div className="border-t">
          <div className="py-5">
            <Typography fontSize={16} fontWeight="bold">
              {translate('quick-order.quick.add.cart')}
            </Typography>
          </div>
          <QuickOrderContent items={quickOrderProducts} />
        </div>
      )}
    </div>
  );
};

export default NavigationSections;
