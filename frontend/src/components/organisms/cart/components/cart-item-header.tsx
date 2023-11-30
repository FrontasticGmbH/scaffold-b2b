import StockIndicator from '@/components/atoms/stock-indicator';
import Typography from '@/components/atoms/typography';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { CartItemHeaderProps } from '../types';

const CartItemHeader = ({ item, className }: CartItemHeaderProps) => {
  const { translate } = useTranslation();

  return (
    <div className={className}>
      {/* Product Name */}
      <Typography fontSize={14} lineHeight="loose" fontWeight="semibold" className="md:text-16" title={item.name}>
        {item.name}
      </Typography>

      {/* Product Model and availability */}
      <div className="mt-3 flex items-center gap-3 md:mt-2 md:grid md:gap-5">
        {item.variant?.sku && (
          <p className="truncate text-12 leading-loose text-gray-600">{`${translate('common.model')}# ${
            item.variant?.sku
          }`}</p>
        )}

        <StockIndicator inStock={item.variant?.isOnStock} />
      </div>
    </div>
  );
};

export default CartItemHeader;
