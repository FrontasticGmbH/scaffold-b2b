import React from 'react';
import { useRouter } from 'next/navigation';
import Typography from '@/components/atoms/typography';
import Link from '@/components/atoms/link';
import Image from '@/components/atoms/Image';
import useListKeyboardNavigation from '@/hooks/useListKeyboardNavigation';
import { classnames } from '@/utils/classnames/classnames';
import { SearchPanelProps } from '../types';

const SearchPanel = ({ className, variant, panelItems, onClick }: SearchPanelProps) => {
  const router = useRouter();

  const slicedPanelItems = panelItems.slice(0, 6);

  const { ref, activeIndex } = useListKeyboardNavigation({
    length: slicedPanelItems.length,
    onSelect: (index) => {
      if (!panelItems[index]) return;

      if (variant === 'lg') router.push(panelItems[index].url);
      else onClick?.(panelItems[index]);
    },
  });

  return (
    <ul className={className} ref={ref}>
      {slicedPanelItems.map((item, index) =>
        variant === 'lg' ? (
          <div
            key={item.sku}
            data-testid="search-panel-item"
            className={classnames('px-4 pb-2 md:px-6', { 'bg-neutral-100': activeIndex === index })}
            tabIndex={-1}
          >
            <Link href={item.url ?? item.sku}>
              <div className="flex items-center justify-start gap-x-5">
                {item.image && (
                  <div className="relative size-[48px]">
                    <Image fill src={item.image} alt={item.name} style={{ objectFit: 'contain' }} />
                  </div>
                )}
                <Typography fontSize={16} className="w-full truncate">
                  {item.name}
                </Typography>
              </div>
            </Link>
          </div>
        ) : (
          <div
            data-testid="search-panel-item"
            key={item.sku}
            className={classnames('flex h-12 cursor-pointer items-center hover:bg-neutral-200', {
              'bg-neutral-100': activeIndex === index,
            })}
            onClick={() => onClick?.(item)}
            tabIndex={-1}
          >
            <div className="w-full px-3">
              <Typography fontSize={16} className="truncate text-gray-700">
                {item.sku ?? item.name}
              </Typography>
            </div>
          </div>
        ),
      )}
    </ul>
  );
};
export default SearchPanel;
