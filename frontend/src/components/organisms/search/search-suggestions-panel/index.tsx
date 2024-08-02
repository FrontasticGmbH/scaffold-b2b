import React from 'react';
import Typography from '@/components/atoms/typography';
import { SearchPanelProps } from '../types';
import SearchPanelItemsLarge from './panel-items-large';

const SearchPanel = ({ className, variant, panelItems, onClick }: SearchPanelProps) => {
  return (
    <div className={className}>
      {panelItems.slice(0, 6).map((item) =>
        variant === 'lg' ? (
          <SearchPanelItemsLarge
            key={item.id}
            id={item.id}
            sku={item.sku}
            name={item.name}
            image={item.image}
            url={item.url}
            maxQuantity={item.maxQuantity}
          />
        ) : (
          <div
            key={item.sku}
            className="flex h-12 cursor-pointer items-center hover:bg-neutral-200"
            onClick={() => onClick?.(item)}
          >
            <div className="w-full px-3">
              <Typography fontSize={16} className="truncate text-gray-700">
                {item.sku ?? item.name}
              </Typography>
            </div>
          </div>
        ),
      )}
    </div>
  );
};
export default SearchPanel;
