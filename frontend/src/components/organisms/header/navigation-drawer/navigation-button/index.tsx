import React, { useContext } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from '@/components/atoms/link';
import Typography from '@/components/atoms/typography';
import { classnames } from '@/utils/classnames/classnames';
import { HeaderContext } from '../../context';
import { NavigationButtonProps } from '../../types';

const NavigationButton = ({ lastIndex, link, onClick }: NavigationButtonProps) => {
  const { hideHeaderMenu, quotas } = useContext(HeaderContext);

  const categoryClassNames = classnames(
    'flex justify-between underline-offset-4 hover:underline',
    lastIndex ? 'pb-0' : 'pb-8 lg:pb-7',
  );

  return (
    <div key={link.categoryId} className="cursor-pointer">
      {link?.subCategories?.length > 0 ? (
        <div onClick={onClick} className={categoryClassNames}>
          <Typography fontSize={16} fontWeight="normal" className="text-gray-700">
            {link.name}
          </Typography>
          <ChevronRightIcon className="w-5 text-gray-700" />
        </div>
      ) : (
        <div onClick={hideHeaderMenu} className="flex items-center justify-between pb-8 lg:pb-7">
          <Link href={link?.path as string}>
            <Typography fontSize={16} className="text-gray-700">
              {link.name}
            </Typography>
          </Link>
          {link.categoryId === 'quotes' && (
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-100">
              <Typography fontSize={12} fontWeight="semibold" align="center" className="text-primary">
                {quotas.toString()}
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavigationButton;
