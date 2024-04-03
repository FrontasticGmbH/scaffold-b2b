import React, { useContext } from 'react';
import ShippingAndLanguageSection from '@/components/organisms/shipping-and-language';
import Typography from '@/components/atoms/typography';
import QuickOrderContent from '@/components/organisms/quick-order/quick-order-accordion/quick-order-content';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useMediaQuery from '@/hooks/useMediaQuery';
import { desktop } from '@/constants/screensizes';
import InfoBanner from '@/components/molecules/info-banner';
import QuickOrderMobileButton from '../quick-order-mobile-button';
import PageLinksSection from './page-links-section';
import CategorySection from './category-section';
import AccountSection from './account-section';
import BackButton from './back-button';
import { HeaderContext } from '../../context';

const NavigationSections = () => {
  const { translate } = useTranslation();
  const [isDesktopSize] = useMediaQuery(desktop);

  const {
    pageLinks,
    navigationLevel,
    showQuickOrder,
    showQuickOrderMenu,
    hideQuickOrderMenu,
    quickOrderSearch,
    onQuickOrderSearch,
    quickOrderProducts,
    addToCart,
    addToCartDisabled,
  } = useContext(HeaderContext);

  const showBackButton = showQuickOrder || navigationLevel.length > 0;
  const pageLinksOrMobileQuickOrderExist = !isDesktopSize || pageLinks.length > 0;
  const pageLinksAndMobileQuickOrderExist = !isDesktopSize && pageLinks.length > 0;

  return (
    <div className="px-4 lg:px-5">
      {(showBackButton || pageLinksOrMobileQuickOrderExist) && <div className="border-t" />}

      {showBackButton && <BackButton />}

      {!showQuickOrder && navigationLevel.length === 0 && pageLinksOrMobileQuickOrderExist && (
        <div className="py-6">
          <QuickOrderMobileButton showQuickOrderMenu={showQuickOrderMenu} />

          {pageLinksAndMobileQuickOrderExist && <div className="pb-8" />}
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
          {addToCartDisabled && (
            <InfoBanner className="mb-5">
              <b>{translate('common.view.only')}</b> {translate('cart.view.only.desc')}
            </InfoBanner>
          )}
          <QuickOrderContent
            items={quickOrderProducts}
            searchText={quickOrderSearch}
            onSearch={onQuickOrderSearch}
            addItem={addToCart}
            addItemDisabled={addToCartDisabled}
            closeMenu={hideQuickOrderMenu}
          />
        </div>
      )}
    </div>
  );
};

export default NavigationSections;
