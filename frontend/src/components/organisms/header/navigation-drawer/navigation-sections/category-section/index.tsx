import React, { useContext } from 'react';
import Link from '@/components/atoms/link';
import Typography from '@/components/atoms/typography';
import { classnames } from '@/utils/classnames/classnames';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import NavigationButton from '../../navigation-button';
import { HeaderContext } from '../../../context';

const CategorySection = () => {
  const { translate } = useTranslation();
  const { categoryLinks, navigationLevel, hideHeaderMenu, insertCategory } = useContext(HeaderContext);
  const categorySectionClassNames = classnames(
    'py-6',
    navigationLevel.length === 0 || navigationLevel[navigationLevel.length - 1]?.name !== 'My Account'
      ? 'border-t'
      : '',
  );
  return (
    <div className={categorySectionClassNames}>
      {navigationLevel && navigationLevel?.length > 0 && (
        <div className="pb-6" onClick={hideHeaderMenu}>
          <Link openInNewTab={false} href={navigationLevel[navigationLevel.length - 1]?.path as string}>
            <Typography fontSize={16} fontWeight="semibold" className="text-gray-700">
              {navigationLevel[navigationLevel.length - 1].name}
            </Typography>
          </Link>
        </div>
      )}
      {navigationLevel && navigationLevel.length === 0 ? (
        <>
          <div className="block pb-5 lg:hidden">
            <Typography fontSize={16} fontWeight="semibold" className="text-gray-800">
              {translate('common.shop.by.category')}
            </Typography>
          </div>
          {categoryLinks?.map((link, index) => (
            <NavigationButton
              key={link.categoryId}
              lastIndex={index === categoryLinks.length - 1}
              link={link}
              onClick={() => insertCategory(link)}
            />
          ))}
        </>
      ) : (
        <>
          {navigationLevel &&
            navigationLevel[navigationLevel.length - 1].subCategories.map((nav) => (
              <NavigationButton key={nav.categoryId} link={nav} onClick={() => insertCategory(nav)} />
            ))}
        </>
      )}
    </div>
  );
};

export default CategorySection;
