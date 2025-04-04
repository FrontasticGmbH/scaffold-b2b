import React, { useContext } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from '@/components/atoms/link';
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
    'flex h-[48px] w-full items-center  pb-2 lg:h-fit lg:pb-7',
    link.categoryId === 'quotes' ? 'justify-between' : 'justify-start',
  );

  return (
    <div key={link.categoryId}>
      {link?.descendants?.length > 0 ? (
        <Button variant="ghost" size="fit" tabIndex={0} onClick={onClick} className={categoryClassNames}>
          <span className="text-16 font-normal text-gray-700">{link.name}</span>
          <ChevronRightIcon className="w-5 text-gray-700" />
        </Button>
      ) : (
        <div className={descendantClassNames}>
          <Link tabIndex={0} href={link?.path ?? '/'} className="w-full">
            <button className="w-full text-left" onClick={hideHeaderMenu}>
              <span className="py-1 text-left text-16 text-gray-700">{link.name}</span>
            </button>
          </Link>
          {link.categoryId === 'quotes' && (
            <div className="flex size-5 items-center justify-center rounded-md bg-blue-100">
              <p className="text-center text-12 font-semibold text-primary">{quotes.toString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavigationButton;
