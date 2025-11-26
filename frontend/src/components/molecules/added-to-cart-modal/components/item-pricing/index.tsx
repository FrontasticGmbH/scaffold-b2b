import QuantityWidget from '@/components/atoms/quantity-widget';
import { ItemPricingProps } from '@/components/molecules/added-to-cart-modal/types';
import useDiscount from '@/hooks/useDiscount';
import useFormat from '@/hooks/useFormat';

const ItemPricing = ({ item, quantity, onQuantityChange }: ItemPricingProps) => {
  const { formatCurrency } = useFormat();
  const { isDiscounted } = useDiscount(item.price, item.discountedPrice, item.discount);

  const handleQuantityChange = (value: number) => {
    if (value > 0) {
      onQuantityChange(value);
    }
  };

  const displayPrice = isDiscounted && item.discountedPrice ? item.discountedPrice : item.price;

  return (
    <div className="row-start-2 flex flex-col items-center justify-center gap-2 md:col-span-5 md:col-start-2 md:row-start-2 md:flex-row md:justify-start md:gap-0 md:pl-6">
      {quantity && quantity > 0 && (
        <div className="mb-0.5 inline-block w-fit text-12 md:order-2 md:mb-0 md:ml-4">
          {isDiscounted && item.discountedPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-600 line-through">{formatCurrency(item.price, item.currency)}</span>
              <span className="font-semibold text-red-500">{formatCurrency(item.discountedPrice, item.currency)}</span>
              <span>/ea</span>
            </div>
          ) : (
            <p>{`${formatCurrency(item.price, item.currency)}/ea`}</p>
          )}
        </div>
      )}
      <div className="inline-block">
        <QuantityWidget
          onChange={handleQuantityChange}
          value={quantity}
          minValue={Math.min(1, item.maxQuantity ?? Infinity)}
          maxValue={item.maxQuantity}
          showLabel={false}
        />
      </div>
      {quantity && (
        <p
          className={`mt-1 text-16 font-semibold leading-tight md:order-3 md:ml-4 md:mt-0 md:inline-block ${isDiscounted ? 'text-red-500' : ''}`}
        >
          {formatCurrency(displayPrice * quantity, item.currency)}
        </p>
      )}
    </div>
  );
};

export default ItemPricing;
