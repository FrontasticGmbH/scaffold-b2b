import StockIndicator from '@/components/atoms/stock-indicator';
import { useTranslations } from 'use-intl';
import Link from '@/components/atoms/link';
import { CartItemHeaderProps } from '../types';

const CartItemHeader = ({ item, className }: CartItemHeaderProps) => {
  const translate = useTranslations();

  return (
    <div className={className}>
      {/* Product Name */}
      <Link
        href={item.url ?? '#'}
        className="max-w-full truncate text-14 font-semibold leading-loose text-gray-800 md:text-16"
      >
        {item.name}
      </Link>

      {/* Product Model and availability */}
      <div className="mt-3 flex items-center gap-3 md:mt-2 md:grid md:gap-5">
        {item.sku && (
          <p className="truncate text-12 leading-loose text-gray-600">{`${translate('common.model')}# ${item.sku}`}</p>
        )}

        <StockIndicator inStock={item.inStock} />
      </div>
    </div>
  );
};

export default CartItemHeader;
