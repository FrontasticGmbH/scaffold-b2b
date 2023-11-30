import React from 'react';
import Typography from '@/components/atoms/typography';
import { SearchPanelProps } from '../types';
import SearchPanelItemsLarge from './panel-items-large';

const SearchPanel = ({ className, panelItems, onClick }: SearchPanelProps) => {
  return (
    <div className={className}>
      {panelItems.slice(0, 6).map((item) =>
        item.url ? (
          <SearchPanelItemsLarge key={item.id} {...item} />
        ) : (
          <div key={item.sku} className="py-2 hover:bg-neutral-200">
            <div onClick={() => onClick?.(item)} className="w-full cursor-pointer px-3">
              <Typography fontSize={16} className="truncate text-gray-700">
                {item.name}
              </Typography>
            </div>
          </div>
        ),
      )}
    </div>
  );
};
export default SearchPanel;
