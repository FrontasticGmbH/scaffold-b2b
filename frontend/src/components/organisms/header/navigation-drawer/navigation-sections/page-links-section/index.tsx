import React, { useContext } from 'react';
import Link from '@/components/atoms/link';
import Typography from '@/components/atoms/typography';
import { HeaderContext } from '../../../context';

const PageLinksSection = () => {
  const { pageLinks, hideHeaderMenu } = useContext(HeaderContext);
  return (
    <>
      {pageLinks.map((pageLink, index) => (
        <div key={index} className={index >= pageLinks.length - 1 ? 'pb-0' : 'pb-8'}>
          <div onClick={hideHeaderMenu}>
            <Link href={pageLink.href ?? '/'}>
              <Typography fontSize={16} fontWeight="semibold" className="text-gray-800">
                {pageLink.name}
              </Typography>
            </Link>
          </div>
        </div>
      ))}
    </>
  );
};

export default PageLinksSection;
