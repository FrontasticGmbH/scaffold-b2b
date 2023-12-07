import React, { useContext } from 'react';
import Link from '@/components/atoms/link';
import Typography from '@/components/atoms/typography';
import { classnames } from '@/utils/classnames/classnames';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import NavigationButton from '../../navigation-button';
import { HeaderContext } from '../../../context';

const CategorySection = () => {
  const { translate } = useTranslation();
  const { categoryLinks, navigationLevel, hideHeaderMenu, insertCategory, isAdmin } = useContext(HeaderContext);
  const categorySectionClassNames = classnames(
    'pb-2 lg:py-6',
    navigationLevel.length === 0 ? 'border-t' : '',
    navigationLevel[navigationLevel.length - 1]?.name !== 'My Account' ? 'lg:border-t' : '',
  );

  return (
    <div className={categorySectionClassNames}>
      {navigationLevel && navigationLevel?.length > 0 && (
        <div className="pb-2 pt-6 lg:pb-6 lg:pt-0">
          <Typography fontSize={16} fontWeight="semibold" className="text-gray-700">
            {navigationLevel[navigationLevel.length - 1].name}
          </Typography>
        </div>
      )}
      {navigationLevel && navigationLevel.length === 0 ? (
        <>
          <div className="block pb-2 pt-6 lg:hidden">
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
          {navigationLevel && (
            <>
              {navigationLevel[navigationLevel.length - 1].categoryId !== 'my-account' && (
                <Link href={navigationLevel[navigationLevel.length - 1]?.path ?? '/'}>
                  <div className="flex h-[48px] items-center pb-2 lg:h-fit lg:pb-7" onClick={hideHeaderMenu}>
                    <Typography fontSize={16} className="text-gray-700">
                      {translate('common.view.all')}
                    </Typography>
                  </div>
                </Link>
              )}
              {navigationLevel[navigationLevel.length - 1].subCategories.map((nav) => (
                <NavigationButton key={nav.categoryId} link={nav} onClick={() => insertCategory(nav)} />
              ))}
            </>
          )}
        </>
      )}
      {isAdmin && (
        <>
          {navigationLevel && navigationLevel[navigationLevel.length - 1]?.name === 'My Account' && (
            <Typography fontSize={16} fontWeight="normal" className="text-gray-300">
              {`${translate('common.company.admin')} - ${translate('common.desktop.only')}`}
            </Typography>
          )}
        </>
      )}
    </div>
  );
};
export default CategorySection;
