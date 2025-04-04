import React, { useContext } from 'react';
import Link from '@/components/atoms/link';
import { classnames } from '@/utils/classnames/classnames';
import { useTranslations } from 'use-intl';
import NavigationButton from '../../navigation-button';
import { HeaderContext } from '../../../context';

const CategorySection = () => {
  const translate = useTranslations();
  const { categoryLinks, navigationLevel, hideHeaderMenu, insertCategory } = useContext(HeaderContext);
  const categorySectionClassNames = classnames(
    'pb-2 lg:py-6',
    navigationLevel.length === 0 ? 'border-t' : '',
    navigationLevel[navigationLevel.length - 1]?.name !== 'My Account' ? 'lg:border-t' : '',
  );

  return (
    <div className={categorySectionClassNames}>
      {navigationLevel && navigationLevel?.length > 0 && (
        <div className="pb-2 pt-6 lg:pb-6 lg:pt-0">
          <p className="text-16 font-semibold text-gray-700">{navigationLevel[navigationLevel.length - 1].name}</p>
        </div>
      )}
      {navigationLevel && navigationLevel.length === 0 ? (
        <>
          <div className="block pb-2 pt-6 lg:hidden">
            <p className="text-16 font-semibold text-gray-800">{translate('common.shop-by-category')}</p>
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
                <Link
                  tabIndex={0}
                  href={
                    navigationLevel[navigationLevel.length - 1]?.path
                      ? `${navigationLevel[navigationLevel.length - 1]?.path}?sortAttributes[0][price]=asc&view=1`
                      : '/'
                  }
                >
                  <button className="flex h-[48px] pb-2 lg:h-fit lg:pb-7" onClick={hideHeaderMenu}>
                    <span className="text-16 text-gray-700">{translate('common.view-all')}</span>
                  </button>
                </Link>
              )}
              {navigationLevel[navigationLevel.length - 1].descendants.map((nav) => (
                <NavigationButton key={nav.categoryId} link={nav} onClick={() => insertCategory(nav)} />
              ))}
            </>
          )}
        </>
      )}

      {navigationLevel && navigationLevel[navigationLevel.length - 1]?.name === 'My Account' && (
        <>
          <div className="h-[48px] w-full pb-2 lg:h-fit lg:pb-7">
            <p className="text-16 font-normal text-gray-300">
              {`${translate('common.company-admin')} - ${translate('common.desktop-only')}`}
            </p>
          </div>

          <div className="h-[48px] w-full pb-2 lg:h-fit lg:pb-7">
            <p className="text-16 font-normal text-gray-300">
              {`${translate('common.approval-rules')} - ${translate('common.desktop-only')}`}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
export default CategorySection;
