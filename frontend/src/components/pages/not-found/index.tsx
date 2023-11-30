import React from 'react';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import { NotFoundProps } from './types';

const NotFound = ({ title, summary, link }: NotFoundProps) => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center pt-[60px] md:pt-[100px] lg:pt-[200px]">
        {title && (
          <h1 className="pb-3 text-18 font-extrabold leading-normal text-gray-700 md:pb-5 md:text-20 lg:pb-6 lg:text-24">
            {title}
          </h1>
        )}

        {summary && <p className="text-14 leading-loose text-gray-600 md:text-16">{summary}</p>}

        {link && (
          <div className="py-4 md:py-6 lg:py-7">
            <Link href={link.href ?? '/'} underlineOnHover={false}>
              <Button variant="primary" className="min-w-[160px] py-2 text-14 lg:py-3 lg:text-16">
                {link.name}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFound;
