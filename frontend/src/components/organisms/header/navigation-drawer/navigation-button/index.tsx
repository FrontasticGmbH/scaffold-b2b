import React, { useContext } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from '@/components/atoms/link';
import Typography from '@/components/atoms/typography';
import { classnames } from '@/utils/classnames/classnames';
import Button from '@/components/atoms/button';
import { HeaderContext } from '../../context';
import { NavigationButtonProps } from '../../types';

const NavigationButton = ({ lastIndex, link, onClick }: NavigationButtonProps) => {
  const { hideHeaderMenu, quotes } = useContext(HeaderContext);

  const categoryClassNames = classnames(
    'flex h-[48px] w-full cursor-pointer items-center justify-between underline-offset-4 hover:underline lg:h-fit',
    lastIndex ? 'pb-0' : 'pb-2 lg:pb-7',
  );
  const descendantClassNames = classnames(
    'flex h-[48px] w-full items-center pb-2 lg:h-fit lg:pb-7',
    link.categoryId === 'quotes' ? 'justify-between' : 'justify-start',
  );

  return (
    <div key={link.categoryId}>
      {link?.descendants?.length > 0 ? (
        <Button variant="ghost" size="fit" tabIndex={0} onClick={onClick} className={categoryClassNames}>
          <Typography fontSize={16} fontWeight="normal" className="text-gray-700">
            {link.name}
          </Typography>
          <ChevronRightIcon className="w-5 text-gray-700" />
        </Button>
      ) : (
        <div className={descendantClassNames}>
          <Link tabIndex={0} href={link?.path ?? '/'} className="w-full">
            <div className="w-full" onClick={hideHeaderMenu}>
              <Typography fontSize={16} className="text-gray-700">
                {link.name}
              </Typography>
            </div>
          </Link>
          {link.categoryId === 'quotes' && (
            <div className="flex size-5 items-center justify-center rounded-md bg-blue-100">
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
