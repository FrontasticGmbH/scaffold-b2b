import React, { useContext } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from '@/components/atoms/link';
import Typography from '@/components/atoms/typography';
import { classnames } from '@/utils/classnames/classnames';
import { HeaderContext } from '../../context';
import { NavigationButtonProps } from '../../types';

const NavigationButton = ({ lastIndex, link, onClick }: NavigationButtonProps) => {
  const { hideHeaderMenu, quotes } = useContext(HeaderContext);

  const categoryClassNames = classnames(
    'flex h-[48px] cursor-pointer items-center justify-between underline-offset-4 hover:underline lg:h-fit',
    lastIndex ? 'pb-0' : 'pb-2 lg:pb-7',
  );
  const subCategoryClassNames = classnames(
    'flex h-[48px] w-full items-center pb-2 lg:h-fit lg:pb-7',
    link.categoryId === 'quotes' ? 'justify-between' : 'justify-start',
  );

  return (
    <div key={link.categoryId}>
      {link?.subCategories?.length > 0 ? (
        <div onClick={onClick} className={categoryClassNames}>
          <Typography fontSize={16} fontWeight="normal" className="text-gray-700">
            {link.name}
          </Typography>
          <ChevronRightIcon className="w-5 text-gray-700" />
        </div>
      ) : (
        <div className={subCategoryClassNames}>
          <Link href={link?.path ?? '/'} className="w-full">
            <div className="w-full" onClick={hideHeaderMenu}>
              <Typography fontSize={16} className="text-gray-700">
                {link.name}
              </Typography>
            </div>
          </Link>
          {link.categoryId === 'quotes' && (
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-100">
              <Typography fontSize={12} fontWeight="semibold" align="center" className="text-primary">
                {quotes.toString()}
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavigationButton;
